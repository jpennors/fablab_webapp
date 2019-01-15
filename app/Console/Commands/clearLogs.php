<?php

namespace App\Console\Commands;

use DB;
use Illuminate\Console\Command;

class clearLogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'log:clear';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete expired log from db';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $nbDeleted = DB::table('Logs')->where('disabled', true)->delete();
        $this->info("$nbDeleted log(s) deleted");
    }
}
