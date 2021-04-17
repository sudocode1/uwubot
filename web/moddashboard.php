<!DOCTYPE html>
<link rel="stylesheet" href="styles.css">

<center>
    <h1 class="title">mod dashboard</h1>
</center>

<center>

<title>Mod Dashboard</title>

<?php
    // todo: get full url and parse it
    $gid = parse_url($_SERVER['REQUEST_URI']);
    //var_dump($gid);

    

    if (!$gid["query"]) {
        die('query is missing');
    }

    //echo $gid["query"];

    
    

    $conn = new mysqli("localhost", "root", "", "uwubot");

    if ($conn->connect_error) {
        die('mysql connection failed');
    }

    if (isset($_POST['sm']) && array_key_exists('secret', $_POST)) {
        
        

        //print_r($_POST);

        $secret = (int)$_POST['secret'];
        $warnchid = (int)$_POST['warnchid'];
        $strike1 = (int)$_POST['strike1'];
        $strike2 = (int)$_POST['strike2'];
        
        //echo $secret.' '.$warnchid.' '.$strike1.' '.$strike2;
        $result = $conn->query("SELECT * FROM modsettings WHERE secret = '$secret'");

        try {
            if (!$result->num_rows) throw new Exception('fail');
        } catch(Exception $e) {
            die('secret was incorrect');
        };

        // $sql = "UPDATE modsettings SET warnChannelId = '$warnchid' strike1RoleId = '$strike1' strike2RoleId = '$strike2' WHERE secret = '$secret'";
        $sql = "UPDATE modsettings SET warnChannelId = '$warnchid' WHERE secret = '$secret'";

        $conn->query("UPDATE modsettings SET warnChannelId = '$warnchid' WHERE secret = '$secret'");
        $conn->query("UPDATE modsettings SET strike1RoleId = '$strike1' WHERE secret = '$secret'");
        $conn->query("UPDATE modsettings SET strike2RoleId = '$strike2' WHERE secret = '$secret'");



        die('settings submitted!');
    }
    
    // $gid = parse_url('http://'.$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF']);
    //echo "connected<br>";

    // todo: use parsed url to fetch guild data
    $sql = "SELECT * FROM modsettings WHERE guildId = " . $gid["query"];
    $result = $conn->query($sql);

    /* 
    todo: if guild exists, create options including a "secret" box to enter the secret
    once settings are submitted, take the values and check the secret using encryption (XOR?)
    if the secret matches up, pass the settings to the database
    */

    try {
        if (!$result->num_rows) throw new Exception('fail');
        //echo '<br><br>'.$result->num_rows.'<br>';

    } catch(Exception $e) {
        die('error fetching rows - guild probably does not exist in the database');
    };
    //echo 'result<br>';
    //var_dump($result);

    $test;

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
           $test = $row;
        }
    }


    echo '<h3>Statistics</h3>';

    //echo var_dump($test);

    try {
        if (!$test['cases']) throw new Exception('fail');
        echo 'total cases: '.$test['cases'].'<br>';
    } catch(Exception $e) {
        echo 'total cases: 0<br>';
    }
    
    try {
        if (!$test['warns']) throw new Exception('fail');
        echo 'total warnings: '.$test['warns'].'<br>';
    } catch(Exception $e) {
        echo 'total warnings: 0<br>';
    }
 
    try {
        if (!$test['kicks']) throw new Exception('fail');
        echo 'total kicks: '.$test['kicks'].'<br>';
    } catch(Exception $e) {
        echo 'total kicks: 0<br>';
    }
    
    try {
        if (!$test['bans']) throw new Exception('fail');
        echo 'total bans: '.$test['bans'].'<br>';
    } catch(Exception $e) {
        echo 'total bans: 0<br>';
    }

    echo '<br>';

    //var_dump($test);
?>

<h3>Update Settings</h3>
<form action="" method="post">
enter secret <br>
<input type="text" name="secret">
<br> <br>
warn channel id <br>
<input type="text" name="warnchid" value=<?php echo htmlspecialchars($test["warnChannelId"]); ?>>
<br> <br>
strike 1 role id <br>
<input type="text" name="strike1" value=<?php echo htmlspecialchars($test["strike1RoleId"]); ?>>
<br> <br>
strike 2 role id <br>
<input type="text" name="strike2" value=<?php echo htmlspecialchars($test["strike2RoleId"]); ?>>
<br><br>
<input type="submit" name="sm" value="Submit">




</form>
</center>

<?php
  $conn->close();
?>