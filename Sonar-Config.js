/* eslint-disable no-undef */
const sonarqubeScanner = require('sonarqube-scanner').default;

sonarqubeScanner(
    {
        serverUrl: 'http://192.168.17.24:9000',
        options: {
            'sonar.projectDescription': 'This is a Node JS application',
            'sonar.projectName': 'lemonpeak_face5_node_service',
            'sonar.projectKey': 'lemonpeak_face5_node_service',
            'sonar.login': 'sqp_e0ecf16dae72fb613a6480a021c6ddc6eb498346',
            'sonar.projectVersion': '1.0',
            'sonar.language': 'js',
            'sonar.sourceEncoding': 'UTF-8',
            'sonar.sources': '.',
            //'sonar.tests': 'specs',
            //'sonar.inclusions' : 'src/**'
            'sonar.java.binaries': '**/*.java'
        }
    },
    () => {
        console.log('SonarQube scan complete!');
    }
);
