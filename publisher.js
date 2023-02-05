const amqplib = require("amqplib");

const input = process.argv[2];

async function connect() {
  try {
    const connectionName = "amqp://localhost:5672";
    const connection = await amqplib.connect(connectionName);
    const channel = await connection.createChannel();

    console.log("Sending data to the queue");

    // const msg = Buffer.from(JSON.stringify({ number: 10 }));

    await Promise.all(
      input.split(",").map(async (number) => {
        const queueName = parseInt(number) % 2 == 0 ? "even" : "odd";

        await channel.assertQueue(queueName);
        await channel.sendToQueue(
          queueName,
          Buffer.from(JSON.stringify({ number: number }))
        );
      })
    );

    await channel.close();
    await connection.close();
  } catch (err) {
    console.log(err);
  }
}

async function sendNumber(channel) {
  const msg = Buffer.from(JSON.stringify({ number: 10 }));
  const queueName = "number";

  await channel.assertQueue(queueName);
  await channel.sendToQueue(queueName, msg);
}

async function sendOddOrEvenNumber() {}

connect();
