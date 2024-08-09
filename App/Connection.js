const winston = require('winston');
const logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

const Conection = {
    expressIgniter: (Express) => {
        Express.listen(2025, () => {
            logger.info('server is started on http://localhost:2025');
        });
    }
};

module.exports = Conection;
