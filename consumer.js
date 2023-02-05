const amqplib = require("amqplib");

const queueName = process.argv[2];

async function consume() {
  try {
    const connectionName = "amqp://localhost:5672";
    // const queueName = "number";

    const connection = await amqplib.connect(connectionName);
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName);

    channel.consume(queueName, (message) => {
      const input = JSON.parse(message.content.toString());
      console.log(`Received number: ${input.number}`);
      channel.ack(message);
    });

    console.log(`Waiting for messages...`);
  } catch (err) {
    console.log(err);
  }
}

consume();
