let eventSource = new EventSource("localhost:3000/jobs/subscribe/randomUUID");

eventSource.onmessage = function(event) {
  console.log("Новое сообщение", event.data);
  // этот код выведет в консоль 3 сообщения, из потока данных выше
};
