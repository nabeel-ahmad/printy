var fs = require('fs');
var IppPrinter = require('ipp-printer');
var Printer = require("node-printer");

var ippPrinter = new IppPrinter({
    name: "Printy",
    port: 631,
    zeroconf: true,
    fallback: true
});

var printerList = Printer.list();
var printer;
if (printerList.length > 0)
    printer = printerList.get(0);


ippPrinter.on('job', function (job) {
    console.log('[job %d] Printing document: %s', job.id, job.name);

    var filename = 'job-' + job.id + '.ps'; // .ps = PostScript
    var file = fs.createWriteStream(filename);

    job.on('end', function () {
        console.log('[job %d] Document saved as %s', job.id, filename);

        if (process.platform != 'win32') {
            printer.printFile({
                filename: filename,
                //printer: process.env[3], // printer name, if missing then will print to default printer
                success: function (jobID) {
                    console.log("sent to printer with ID: " + jobID);
                },
                error: function (err) {
                    console.log(err);
                }
            });
        } else {
            // not yet implemented, use printDirect and text
            var fs = require('fs');
            printer.printDirect({
                data: fs.readFileSync(filename),
                printer: process.env[3], // printer name, if missing then will print to default printer
                success: function (jobID) {
                    console.log("sent to printer with ID: " + jobID);
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    });

    job.pipe(file)
});

