// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window['pdfjs-dist/build/pdf'];
// The workerSrc property shall be specified.
// pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';
function dragNdrop(e) {
	$('.errorMsg').hide();
	$('#static').hide();
	$('.statusMsg').html('');
	$('#status').show();
	var file = e.target.files[0]
	if(file.type == "application/pdf"){
		// $('.statusMsg').html('Reading the PDF file...');
		$('.statusMsg').html('');
		var fileReader = new FileReader();  
		fileReader.onload = function() {
			var pdfData = new Uint8Array(this.result);
			// Using DocumentInitParameters object to load binary data.
			var loadingTask = pdfjsLib.getDocument({data: pdfData});
			loadingTask.promise.then(function(pdf) {
				// $('.statusMsg').html('PDF loaded...');
				$('.uploadBoxContainer').hide();
			  // Fetch the first page
			  var pageNumber = 1;
			  pdf.getPage(pageNumber).then(function(page) {
				// $('.statusMsg').html('The Page of PDF is loaded');
				var scale = 1.0;
				var viewport = page.getViewport({scale: scale});

				//updated by Polaris
				scale = $(window).width() / viewport.width;
				scale = scale.toFixed(2)-0.01;
				viewport = page.getViewport({scale: scale});

				// Prepare canvas using PDF page dimensions
				var canvas = $("#pdfViewer")[0];
				var context = canvas.getContext('2d');
				canvas.height = viewport.height;
				canvas.width = viewport.width;

				// Render PDF page into canvas context
				var renderContext = {
				  canvasContext: context,
				  viewport: viewport
				};
				var renderTask = page.render(renderContext);
				renderTask.promise.then(function () {
				//   console.log('Page rendered');
				//   $('.statusMsg').html('Page of PDF is rendered');
				  $('.uploadBoxContainer').hide();
				});
			  });
			}, function (reason) {
			  // PDF loading error
			  console.error(reason);
			  $('.errorMsg').html("Please try uploading the demo file only.");
			  $('.errorMsg').show();			
			  $('#static').show();
			  $('#status').hide();  
			});
		};
		fileReader.readAsArrayBuffer(file);
	} else {
		$('.errorMsg').html("Please try uploading the demo file only.");
		$('.errorMsg').show();
		$('#static').show();
		$('#status').hide();  
	}
}
function drag() {
    document.getElementById('uploadFile').parentNode.className = 'draging dragBox';
}
function drop() {
    document.getElementById('uploadFile').parentNode.className = 'dragBox';
}