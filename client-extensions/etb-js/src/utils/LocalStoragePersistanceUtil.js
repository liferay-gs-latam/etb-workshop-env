class LocalStoragePersistanceUtil {
  constructor(key) {
    this.key = key;
    return this;
  }

  isExpired(created, duration) {
    if (!duration) {
      return false;
    }

    const expirationTime = new Date(created);
    expirationTime.setTime(expirationTime.getTime() + duration * 60 * 60 * 1000);

    return new Date() >= expirationTime;
  }

  delete() {
    localStorage.removeItem(this.key);
  }

  get() {
    const storedObj = localStorage.getItem(this.key);
    if (!storedObj) {
      return null;
    }

    try {
      const parsedObj = JSON.parse(storedObj);
      if (!parsedObj.created) {
        return null;
      }

      if (this.isExpired(parsedObj.created, parsedObj.duration)) {
        this.delete();
        return null;
      }

      return parsedObj;
    } catch (error) {
      console.error('Error parsing stored object:', error);
      return null;
    }
  }

  set(data, duration = null) { // Optional duration
    const now = new Date();
    const obj = {
      created: now.getTime(),
      duration,
      data,
    };
    const objString = JSON.stringify(obj);
    return localStorage.setItem(this.key, objString);
  }
}

export default LocalStoragePersistanceUtil;