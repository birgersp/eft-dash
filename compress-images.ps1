$srcDir = "./images/highres"
$destDir = "./images/lowres"
$files = Get-ChildItem "$srcDir"

foreach ($name in $files) {

	$file = "$srcDir/$name"
	py C:\Users\birge\repo\tools\scripts\resize-image.py file="$file" output_dir="$destDir" mheight=1440 mwidth=2560
}
