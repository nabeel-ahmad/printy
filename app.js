var fs = require('fs');
var IppPrinter = require('ipp-printer');
var exec = require('child_process').exec;

var ippPrinter = new IppPrinter({
    name: "Printy",
    port: 631,
    zeroconf: true,
    fallback: true
});


ippPrinter.on('job', function (job) {
    console.log('[job %d] Printing document: %s', job.id, job.name, 'from user:', job.userName);

    var filename = 'job-' + job.id + '.ps'; // .ps = PostScript
    var file = fs.createWriteStream(filename);

    job.on('end', function () {
        console.log('[job %d] Document saved as %s', job.id, filename);


        exec('lp ' + filename, function (error, stdout, stderr) {
            if (error)
                console.log(error);
            else
                console.log(stdout);
        });

    });

    job.pipe(file)
});

