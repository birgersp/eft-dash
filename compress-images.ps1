$srcDir = "./images/highres"
$destDir = "./images/lowres"
$files = Get-ChildItem "$srcDir"

foreach ($name in $files) {

	$file = "$srcDir/$name"
	resize-image.py file="$file" output_dir="$destDir" mheight=1440 mwidth=2560
}
