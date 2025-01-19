export const log = (
  debug: boolean,
  caller: string,
  message: string,
  object?: Object,
  isJSON?: boolean
) => {
  if (debug) {
    if (object !== undefined) {
      if (isJSON) {
        console.log(`[${caller}]: ${message} => ${JSON.stringify(object)}`);
      } else {
        console.log(`[${caller}]: ${message} => ${object}`);
      }
    } else {
      console.log(`[${caller}]: ${message}`);
    }
  }
};
