<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once 'vendor/autoload.php';

//sends mail to user
function sendMail($email, $subject, $message)
{
    $mail = new PHPMailer(true);
    try {
        //Server settings
        $mail->isSMTP();
        $mail->SMTPAuth   = true;
        $mail->Host       = 'smtp.mail.yahoo.com';
        $mail->Username   = 'jerry_obico@yahoo.com';
        $mail->Password   = 'sfkvpvsnyuvvuqvh';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        //Recipients
        $mail->setFrom('jerry_obico@yahoo.com', 'Pasig TRMS Support');
        $mail->addAddress($email);

        //Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $message;
        $mail->AltBody = $message;

        if ($mail->send()) {
            return 'success';
        }
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}

//general audit log
function log_action($userid, $action, $description, $conn)
{
    $stmt = $conn->prepare('INSERT INTO audit_log (userid, action, description) VALUES (?, ?, ?)');
    $stmt->bind_param('iss', $userid, $action, $description);
    $stmt->execute();
    $stmt->close();
}

//log for create
function log_add($userid, $table, $data, $conn)
{
    $description = "Added new record to $table: " . json_encode($data);
    log_action($userid, 'Add', $description, $conn);
}

//log for update
function log_edit($userid, $table, $oldData, $newData, $conn)
{
    $description = "Edited record in $table. Old values: " . json_encode($oldData) . "; New values: " . json_encode($newData);
    log_action($userid, 'Edit', $description, $conn);
}

//log for delete
function log_delete($userid, $table, $data, $conn)
{
    $description = "Deleted record from $table: " . json_encode($data);
    log_action($userid, 'Delete', $description, $conn);
}
