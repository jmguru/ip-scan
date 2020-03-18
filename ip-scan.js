const evilscan = require('evilscan');
const util = require('util');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const DEFAULT_IP='192.168.1.0/24';
const DEFAULT_PORT='21-23/80';
var usingDefaults=false;

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
    console.log('\n\nNo IP or port specified. Using defaults %s and %s\n\n',DEFAULT_IP,DEFAULT_PORT);
    usingDefaults=true; 
}

if(usingDefaults==false)
    scan(options.ip,options.port);
else
    scan(DEFAULT_IP,DEFAULT_PORT);

function scan(sTarget, sPort) {

    var options = {
	target:sTarget, 
        port:sPort,
        status:'TROU', // Timeout, Refused, Open, Unreachable
        banner:true
    };
    
    var scanner = new evilscan(options);
    
    console.log('Scan Results:\n------------\n');
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

