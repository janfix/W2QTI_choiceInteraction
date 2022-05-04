<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use ZipArchive;



class convertisseur extends Controller
{
       
    public function createRootDir(Request $request)
    {
       //echo 'problem ?';
       $dirname = $request->dirname;
       mkdir($dirname, 0777, true);
    }

    public function createDirs(Request $request)
    {
        $data = $request->data;
        $dirname = $request->dirname;
        for ($i=1; $i < ($data) ; $i++) { 
        mkdir($dirname.'/Q'.$i, 0777, true);	
        }
    }

    public function createManifest(Request $request)
    {   //fusion header / ressources // footer
        $data = $request->data;
        $dirname = $request->dirname;
        $manifest = fopen($dirname."/imsmanifest.xml", "w");
        fwrite($manifest,$data);
        fclose($manifest);
    }

     public function writeQTIContent(Request $request)
    {   
        $data = $request->data;
        $QTI_id = $request->name;
        $dirname = $request->dirname;
        $qtiContent = fopen($dirname."/".$QTI_id."/qti.xml", "w");
        fwrite($qtiContent,$data);
        fclose($qtiContent);
    }

    public function qtizipper(Request $request)
    {
       
        $dirname = $request->dirname;
      // Get real path for our folder
        $rootPath = realpath($dirname);

        // Initialize archive object
        $zip = new ZipArchive();
        $fileName = "qti_".uniqid().".zip";
      
        if ($zip->open(public_path($fileName), ZipArchive::CREATE) === TRUE)
        {          
            $this->addContent($zip,  $dirname); 
            $zip->close();   
        }

       
      return response($fileName);
        //return response()->download(public_path($fileName));
       
    }

       private function addContent(\ZipArchive $zip, string $path)
    {
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator(
                $path,
                \FilesystemIterator::FOLLOW_SYMLINKS
            ),
            \RecursiveIteratorIterator::SELF_FIRST
        );

         while ($iterator->valid()) {
            if (!$iterator->isDot()) {
                $filePath = $iterator->getPathName();
                $relativePath = substr($filePath, strlen($path) + 1);
    
                if (!$iterator->isDir()) {
                    $zip->addFile($filePath, $relativePath);
                } else {
                    if ($relativePath !== false) {
                        $zip->addEmptyDir($relativePath);
                    }
                }
            }
            $iterator->next();
        }

    }

    public function cleaner(Request $request)
    {
        $dirname = $request->dirname;
        $zipfile = $request->zipname;
        
        function deleteDirectory($dir) {
            if (!file_exists($dir)) {
                return true;
            }
            if (!is_dir($dir)) {
                return unlink($dir);
            }
            foreach (scandir($dir) as $item) {
                if ($item == '.' || $item == '..') {
                    continue;
                }
                if (!deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
                    return false;
                }
            }
            return rmdir($dir);
        }

        deleteDirectory($dirname);

   
        //array_map('unlink', glob());
        unlink($zipfile);
        return response($zipfile);
    }
}
