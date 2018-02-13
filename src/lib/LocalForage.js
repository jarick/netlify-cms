import LocalForage from "localforage";

function testLocalForage() {
  const testKey = 'LocalForageTest';
  LocalForage.setItem(testKey, { expires: Date.now() + 300000 }).then(() => {
    LocalForage.removeItem(testKey);
  }).catch((err) => {
    if (err.code === 22) {
      const message = `Uable to set localStorage key. Quota exceeded! Full disk?`;
      // eslint-disable-next-line
      return alert(`${ message }\n\n${ err }`);
    }
    // eslint-disable-next-line
    console.log(err);
    return null;
  });
}

if (typeof process === 'undefined') {
  testLocalForage();
}

export default LocalForage;
