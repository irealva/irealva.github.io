<?php
error_reporting(E_ALL);
ini_set('display_errors', true);
date_default_timezone_set('America/Montreal');
session_start();
header('Access-Control-Allow-Origin: *');
if(isset($_REQUEST['callback'])) {
  header('Content-type: text/javascript');
} else {
  header('Content-type: application/json');
}
$sid = session_id();
// Output JSON Array
$array = array();
if(isset($_REQUEST['key']) && isset($_REQUEST['data'])) {
        $timeoutSeconds = 30;
        $filename = dirname(__FILE__) . '/counter.db';
        //unlink($filename);
        $db = new PDO('sqlite:' . $filename);
        $db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
        // 1. create a sqlite database table with the following columns if it does not already exist in the current directory: id, timestamp, session_id
        $stmt = $db->prepare('CREATE TABLE IF NOT EXISTS counter (id INTEGER PRIMARY KEY AUTOINCREMENT, key varchar(32), data varchar(256), timestamp TIMESTAMP, session_id varchar(32))');
        $stmt->execute();
        // 3. get the key/bucket name
        $key = $_REQUEST['key'];
        $data = $_REQUEST['data'];
        
        $stmt = $db->prepare('SELECT id, timestamp, session_id FROM counter');
        $stmt->execute();
        //var_dump($stmt->fetchAll());
        // 2. remove all rows with timestamps less than current_time - timeout.
        $mindate = time() - $timeoutSeconds;
        $mindate = date('Y-m-d H:i:s', $mindate);
        $stmt = $db->prepare("DELETE FROM counter WHERE timestamp < :timestamp AND key = :key");
    $stmt->execute(array(':timestamp' => $mindate, ':key' => $key));
        // 4. add a row for session_id if it does not exist, or update the timestamp of the row with the provided session_id if it does exist
        $stmt = $db->prepare('select id from counter where session_id = :sid AND key = :key');
    $stmt->execute(array(':sid' => $sid, ':key' => $key));
        $rows = $stmt->fetch(PDO::FETCH_NUM);
        
        
        $now = date('Y-m-d H:i:s');
        if($rows === FALSE) {
                   $stmt = $db->prepare('INSERT INTO counter (timestamp, session_id, key, data) VALUES(:timestamp, :sid, :key, :data)');
            $ret = $stmt->execute(array(':sid' => $sid, ':timestamp' => $now, ':key' => $key, ':data' => $data));
        }
        else {
                $id = $rows[0];
                $stmt = $db->prepare('UPDATE counter SET timestamp=:timestamp, data=:data WHERE id= :id AND key = :key');
            $ret = $stmt->execute(array(':id' => $id, ':timestamp' => $now, ':key' => $key, ':data'=>$data));
        }
        
        // 5. return json of the following form to report on the number of users : {"count": n}    for instance:   {"count": 4}
        $stmt = $db->prepare('select * from counter WHERE key = :key');
    $stmt->execute(array(':key' => $key));
    $count = 0;
    $results = array();
        while($rows = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $result = array();
                $result['sid'] = $rows['session_id'];
                $result['data'] = $rows['data'];
                array_push($results, $result);
                $count++;
        }
        $array['count'] = $count;
        $array['results'] = $results;
        $array['time'] = time();
        $array['status'] = "success";
} else {
        $array['status'] = "error";
        $array['error'] = "required parameters key and/or data not provided";
}
if(isset($_REQUEST['callback'])) {
  die($_REQUEST['callback'] . "(" . json_encode($array) . ")");
} else {
  die(json_encode($array));
}
?>
