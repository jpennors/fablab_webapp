<?php

namespace App\Console\Commands;

use DB;
use Illuminate\Console\Command;

class unvalidateLogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'log:unvalidate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Disable every enabled logs';

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
        $nbUpdated = DB::table('Logs')->where('disabled', false)->update(['disabled' => true]);
        $this->info("$nbUpdated log(s) disabled");
    }
}
