const winston = require('winston');
const logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

const Conection = {
    expressIgniter: (Express) => {
        Express.listen(2023, () => {
            logger.info('server is started on http://localhost:2023');
        });
    }
};

module.exports = Conection;
