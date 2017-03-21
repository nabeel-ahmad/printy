var fs = require('fs');
var IppPrinter = require('ipp-printer');
var exec = require('child_process').exec;
var Printer = require('node-printer');

var ippPrinter = new IppPrinter({
    name: "Printy",
    port: 3000,
    zeroconf: true,
    fallback: true
});

// Get available printers list
console.log('[           AVAILABLE PRINTERS           ]');
console.log(Printer.list());
// Create a new Pinter from available devices
var printer = new Printer('Xerox_WorkCentre_3220');

ippPrinter.on('job', function (job) {
    console.log('[job %d] Printing document: %s', job.id, job.name, 'from user:', job.userName);

    var filename = 'job-' + job.id + '.ps'; // .ps = PostScript
    var file = fs.createWriteStream(filename);

    job.on('end', function () {
        console.log('[job %d] Document saved as %s', job.id, filename);

        // var filePath = '/home/pi/Desktop/printy/printy-master/job-1.ps';
        var jobFromFile = printer.printFile(filename);
        // Listen events from job
        jobFromFile.once('sent', function() {
            jobFromFile.on('completed', function() {
                console.log('Job ' + jobFromFile.identifier + 'has been printed');
                jobFromFile.removeAllListeners();
            });
        });
    });

    job.pipe(file)
});