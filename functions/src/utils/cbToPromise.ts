
/**
 * helper function to turn callback based functions into promises
 */
export function cbToPromise(func: (...args: any[]) => void, ...parameters: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    console.log('cbToPromise',{parameters})
    func(...parameters, (error: any, response: any, body: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}
