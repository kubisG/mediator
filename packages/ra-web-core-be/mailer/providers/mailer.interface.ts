export interface Mailer {
    connect();
    close();

    send(from: string, to: string, subject: string, text: string);
}
