const evilscan = require('evilscan');
const util = require('util');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');

const optionDefinitions = [
    { name: 'ip', alias: 'i', type: String},
    { name: 'port', alias: 'p', type: String}
]
const options = commandLineArgs(optionDefinitions);

const sections = [
    {
      header: 'ip-scan',
      content: 'Simply scans a network given an ip and port.'
    },
    {
      header: 'Options',
      optionList: [
        {
            name: 'ip',
            description: 'IP address or range like 192.168.1.0/24'
        },
        {
            name: 'port',
            description: 'Port or port range like 21-23,80'
        }
      ]
    }
  ]

const usage = commandLineUsage(sections)

if(!options.ip || !options.port) {
    console.log(usage);
    process.exit(-1);
}

scan(options.ip,options.port);

function scan(sTarget, sPort) {
    var options = {
        target: sTarget,
        port: sPort,
        status:'TROU', // Timeout, Refused, Open, Unreachable
        banner:true
    };

    var scanner = new evilscan(options);


    scanner.on('result',function(data) {
      var rp = '';

      if(data.status === 'open' && (data.banner || data.banner!='') ) {

         if(data.banner.toString().includes('Raspbian')) {
             rp = '-RaspberryPi'; 
         } 
         console.log(util.format('%s : SSH %s',data.ip,rp));
      }
    });

    scanner.on('error',function(err) {
        throw new Error(data.toString());
    });

    scanner.on('done',function() {
        // finished !
    });

    scanner.run();
}

