<?php
namespace App\Http\Controllers;


// use Encore\Admin\Facades\Admin;
// use Encore\Admin\Layout\Content;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
// use LogViewer;

class LogController extends Controller
{
    public function getLog($file = null, Request $request)
    {
        $files = $this->getLogFiles();

        foreach ($files as $file) {
            // dd($this->getFilePath($file));
            $filePath = $this->getFilePath($file);
            // dd($filePath);
            dd($this->fetch($filePath));
        }
        dd($files);
        // if ($file === null) {
        //     // $l = LogViewer();
        //     $file = $this->getLastModifiedLog();
        //     // $file = (new LogViewer())->getLastModifiedLog();
        // }
        // dd($file);
        // return Admin::content(function (Content $content) use ($file, $request) {
        //     $offset = $request->get('offset');
        //     $viewer = new LogViewer($file);
        //     $content->body(view('laravel-admin-logs::logs', [
        //         'logs'      => $viewer->fetch($offset),
        //         'logFiles'  => $viewer->getLogFiles(),
        //         'fileName'  => $viewer->file,
        //         'end'       => $viewer->getFilesize(),
        //         'tailPath'  => route('log-viewer-tail', ['file' => $viewer->file]),
        //         'prevUrl'   => $viewer->getPrevPageUrl(),
        //         'nextUrl'   => $viewer->getNextPageUrl(),
        //         'filePath'  => $viewer->getFilePath(),
        //         'size'      => static::bytesToHuman($viewer->getFilesize()),
        //     ]));
        //     $content->header($viewer->getFilePath());
        // });
    }
    // public function tail($file, Request $request)
    // {
    //     $offset = $request->get('offset');
    //     $viewer = new LogViewer($file);
    //     list($pos, $logs) = $viewer->tail($offset);
    //     return compact('pos', 'logs');
    // }
    // protected static function bytesToHuman($bytes)
    // {
    //     $units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    //     for ($i = 0; $bytes > 1024; $i++) {
    //         $bytes /= 1024;
    //     }
    //     return round($bytes, 2).' '.$units[$i];
    // }

    /**
     * Get log file list in storage.
     *
     * @param int $count
     *
     * @return array
     */
    public function getLogFiles($count = 20)
    {
        $files = glob(storage_path('logs\\*'));
        $files = array_combine($files, array_map('filemtime', $files));
        arsort($files);
        $files = array_map('basename', array_keys($files));
        return array_slice($files, 0, $count);
    }
    /**
     * Get the last modified log file.
     *
     * @return string
     */
    public function getLastModifiedLog()
    {
        $logs = $this->getLogFiles();
        return current($logs);
    }

    /**
     * Get file path by giving log file name.
     *
     * @throws \Exception
     *
     * @return string
     */
    public function getFilePath($file)
    {
        // if (!$this->filePath) {
            $path = sprintf(storage_path('logs\\%s'), $file);
            if (!file_exists($path)) {
                throw new \Exception('log not exists!');
            }
            $filePath = $path;
        // }
        return $filePath;
    }

    /**
     * Fetch logs by giving offset.
     *
     * @param int $seek
     * @param int $lines
     * @param int $buffer
     *
     * @return array
     *
     * @see http://www.geekality.net/2011/05/28/php-tail-tackling-large-files/
     */
    public function fetch($filePath, $seek = 0, $lines = 20, $buffer = 4096)
    {
        $f = fopen($filePath, 'rb');
        if ($seek) {
            fseek($f, abs($seek));
        } else {
            fseek($f, 0, SEEK_END);
        }
        if (fread($f, 1) != "\n") {
            $lines -= 1;
        }
        fseek($f, -1, SEEK_CUR);
        // Start reading

        $pageOffset = [];
        if ($seek > 0) {
            $output = '';
            $pageOffset['start'] = ftell($f);
            while (!feof($f) && $lines >= 0) {
                $output = $output.($chunk = fread($f, $buffer));
                $lines -= substr_count($chunk, "\n[20");
            }
            $pageOffset['end'] = ftell($f);
            while ($lines++ < 0) {
                $strpos = strrpos($output, "\n[20") + 1;
                $_ = mb_strlen($output, '8bit') - $strpos;
                $output = substr($output, 0, $strpos);
                $pageOffset['end'] -= $_;
            }
            // 从后往前读,下一页
        } else {
            $output = '';
            $pageOffset['end'] = ftell($f);
            while (ftell($f) > 0 && $lines >= 0) {
                $offset = min(ftell($f), $buffer);
                fseek($f, -$offset, SEEK_CUR);
                $output = ($chunk = fread($f, $offset)).$output;
                fseek($f, -mb_strlen($chunk, '8bit'), SEEK_CUR);
                $lines -= substr_count($chunk, "\n[20");
            }
            $pageOffset['start'] = ftell($f);
            while ($lines++ < 0) {
                dd($lines);
                $strpos = strpos($output, "\n[20") + 1;
                dd($strpos);    
                $output = substr($output, $strpos);
                $pageOffset['start'] += $strpos;
            }
            // dd($lines);

        }
        fclose($f);
        // dd($output);
        return $this->parseLog($output);
    }

    /**
     * Get log file list in storage.
     *
     * @param int $count
     *
     * @return array
     */
    // public function getLogFiles($count = 20)
    // {
    //     $files = glob(storage_path('logs/*'));
    //     $files = array_combine($files, array_map('filemtime', $files));
    //     arsort($files);
    //     $files = array_map('basename', array_keys($files));
    //     return array_slice($files, 0, $count);
    // }

    /**
     * Parse raw log text to array.
     *
     * @param $raw
     *
     * @return array
     */
    protected function parseLog($raw)
    {
        // dd($raw);
        $test = preg_match ('/(\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\])/' , trim($raw));
        dd($test);
        # $logs = preg_split('/((\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]) (\.(\w+)\:) ((\w+|\s|\n|\W)+?(?=\[\d{4}(?:-\d{2}){2} \d{2}(?::\d{2}){2}\])))/', trim($raw), -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);
        // $logs = preg_split('/\[(\d{4}(?:-\d{2}){2} \d{2}(?::\d{2}){2})\] (\w+)\.(\w+):((?:(?!{"exception").)*)?/', trim($raw), -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);
        // $logs = preg_split("/[\s,]*\\\"([^\\\"]+)\\\"[\s,]*|" . "[\s,]*'([^']+)'[\s,]*|" . "[\s,]+/", $raw, 0, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE);
        // $logs = preg_split('/\[([0-9]{4}-[0-9]{2}-[0-9]{2})\]/', trim($raw), -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);
        
        dd($logs);
        foreach ($logs as $index => $log) {
            if (preg_match('/^\d{4}/', $log)) {
                break;
            } else {
                unset($logs[$index]);
            }
        }
        if (empty($logs)) {
            return [];
        }
        $parsed = [];
        foreach (array_chunk($logs, 5) as $log) {
            $parsed[] = [
                'time'  => $log[0] ?? '',
                'env'   => $log[1] ?? '',
                'level' => $log[2] ?? '',
                'info'  => $log[3] ?? '',
                'trace' => trim($log[4] ?? ''),
            ];
        }
        unset($logs);
        rsort($parsed);
        return $parsed;
    }
}