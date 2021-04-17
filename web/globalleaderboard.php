<!DOCTYPE html>
<link rel="stylesheet" href="styles.css">

<title>Global Leaderboard</title>

<center>
    <h1 class="title">global leaderboard</h1>
</center>

<center>
<table>
    <!-- style="width: 100%;" -->
  <tr>
    <th>#</th>
    <th>Username</th>
    <th>Level</th>
    <th>XP</th>
  </tr>

  <!-- <tr>
    <td>January</td>
    <td>$100</td>
  </tr> -->


<?php
    $conn = new mysqli("plesk.oxide.host", "sudocode_uwu", "F6f7f8f10@", "uwubot");

    if ($conn->connect_error) {
        die('mysql connection failed');
    }

    //echo "connected<br>";

    $sql = "SELECT * FROM xp ORDER BY level DESC, xpCount DESC";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
      $rank = 0;
        while($row = $result->fetch_assoc()) {
            // echo "id: " . $row["userId"]. " - xp: " . $row["xpCount"]. " - level:" . $row["level"]. "<br>";
            ++$rank;
            echo "<tr><td>". $rank . "</td><td>" . $row["username"] . "</td><td>" . $row["level"] . "</td><td>" . $row["xpCount"] . "</td></tr>";
        }
    }
?>

</table>
<center>

<?php
  $conn->close();
?>