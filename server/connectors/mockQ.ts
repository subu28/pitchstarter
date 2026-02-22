const workerTypeList: {type: string, worker: (payload: any) => void}[] = []

const addTask = (task: any) => {
  const mapping = workerTypeList.find(worker => worker.type === task.type)
  if (mapping) {
    mapping.worker(task.payload);
  } else {
    console.log(`unkonwn task type ${task.type}`);
  }
};

const registerWorker = (type: string, worker: (payload: any) => void) => {
  workerTypeList.push({type, worker})
};

export {
  addTask,
  registerWorker 
}