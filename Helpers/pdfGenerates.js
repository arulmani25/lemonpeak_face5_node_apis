const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const SubmittedCheckListModel = require('../Models/SubmitChecklistModel');
const ActivityModel = require('../Models/ActivityModel');
const SiteManagementModel = require('../Models/SiteManagementModel');

const generatePdf = async (payload) => {
    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: 'new'
        });
        const page = await browser.newPage();

        const checklist = await SubmittedCheckListModel.aggregate([
            { $match: { job_details_id: payload?.job_details_id } },
            {
                $lookup: {
                    from: 'jobdetails',
                    localField: 'job_id',
                    foreignField: '_id',
                    as: 'jobInfo'
                }
            },
            {
                $unwind: {
                    path: '$jobInfo',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);
        if (!checklist || checklist.length === 0) {
            return { success: false, message: 'Checklist not found or empty' };
        }

        const siteInfo = await SiteManagementModel.findOne({
            site_id: checklist[0].jobInfo.site_id
        });

        if (!siteInfo) {
            return { success: false, message: 'Site information not found' };
        }

        const activityInfo = await ActivityModel.findOne({
            activity_id: checklist[0].jobInfo.activity_id
        });
        if (!activityInfo) {
            return { success: false, message: 'Activity information not found' };
        }

        let additionalRowHTML = '';
        if (Array.isArray(checklist[0].submittedData)) {
            checklist[0].submittedData.forEach((record, index) => {
                let fieldValue = record.field_value;
                // Check if the field_name is "File" or "sign" and convert the URL to an image tag
                if (record.field_type === 'File' || record.field_type === 'Signature') {
                    fieldValue = `<img src="${record.field_value}" style="width:100px" alt="${record.field_name}">`;
                }

                additionalRowHTML += `
                  <tr>
                      <td style="text-align:center">${index + 1}.</td>
                      <td style="text-align:center">${record.field_name}</td>
                      <td style="text-align:center">${fieldValue}</td>
                  </tr>
            `;
            });
        } else {
            return { success: false, message: 'Data is not an array' };
        }
        // Construct HTML content with data
        const htmlContent = `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>PDF Example</title>
                            <!-- Include Bootstrap CSS -->
                            <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" rel="stylesheet">
                            <style>
                                body {
                                    margin: 0;
                                    font-family: Arial, sans-serif;
                                    color: black;
                                }
                                .container {
                                    width: 100%;
                                    padding: 30px;  /* This should match the PDF margins */
                                    box-sizing: border-box;
                                }
                                th, td {
                                    font-size: 13px;
                                    text-align: left;
                                    border-color: black !important;
                                }
                                th {
                                    font-size: 15px;
                                    text-align: center;
                                }
                                .invoice {
                                    background: #fff;
                                    width: 100%;
                                }
                                .logo {
                                    width: 2.5cm;
                                }
                                .text-heading {
                                    font-size: 15px;
                                }
                                .text {
                                    font-size: 13px;
                                }
                                #theadrow {
                                    background-color: white;
                                    color: black;
                                }
                                .bottom-page {
                                    font-size: 13px;
                                }
                            </style>
                </head>
                <body>
                <div class="container">
                    <div class="invoice">
                        <div class="row">
                            <div class="col-3">
                                <img class="img-fluid" width="150px" src="http://18.61.82.213:3000/api/Face5_Logo2-2 text.png" alt="Face5 Logo">
                            </div>
                        <div class="col-9 d-flex align-items-center">
                            <div class="row">
                                <div class="col-12 text-right">
                                    <h6 style="font-size: 18px; margin-bottom: 0;">${siteInfo?.address?.fullAddress}</h6>
                                </div>
                            </div>
                        </div>
                    </div><br>

                    <div class="col-12" style="padding:10px; border:1px solid black;">
                        <h6 style="font-size: 28px; text-align: center; margin-top: 14px;">${activityInfo.title}</h6> 
                    </div><br>

                    <div class="row mt-4">
                        <div class="col">
                            <p class='text-heading'><strong>Task ID:</strong>${checklist[0].jobInfo.jobId}</p>
                        </div>
                        <div class="col text-right">
                            <p class='text-heading'><strong>Completion Date:</strong>${checklist[0].createdAt.toISOString().split('T')[0]}</p> 
                        </div>
                    </div>
                </div>

                <div class="row mt-3">
                    <div class="col-12">
                        <p class='text-heading'><strong>Task Title:</strong>${checklist[0].jobInfo.jobTitle}</p>
                    </div>
                </div>

                <div>
                    <table class="table table-bordered">
                        <thead>
                            <tr id="theadrow">
                                <th style="text-align:center">S.No</th>
                                <th style="text-align:center">ACTIVITIES TO BE CARRIED OUT</th>
                                <th style="text-align:center">ACTION</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${additionalRowHTML}
                        </tbody>
                    </table>
                </div><br>

                <footer>
                    <div class="row">
                        <div class="col text-left">
                            <p class="bottom-page">${checklist[0].jobInfo.techName}<br>Technician Name</p>
                        </div>
                        <div class="col text-right">
                            <img class="img-fluid" width="40px" src="${payload.sign_url}" alt="Signature"><br>
                            Signature<br>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    </body>
</html>`;

        // Generate PDF from HTML content
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Define the upload directory and the PDF filename
        const uploadDir = path.join(__dirname, '../Pdfupload');
        const pdfFilename = path.join(uploadDir, 'output.pdf');

        // Check if the directory exists, if not create it
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate the PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '30px',
                bottom: '30px',
                left: '30px',
                right: '30px'
            },
            path: pdfFilename
        });

        // Close the browser
        await browser.close();
        return { success: true, message: 'PDF generated successfully', path: pdfFilename };
    } catch (err) {
        console.log(1, err.message);
        return { success: false, message: err.message };
    }
};

module.exports = { generatePdf };
