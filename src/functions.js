// set data to the local storage
const setData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// get data from the local storage
const getData = (key) => {
  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key));
  } else {
    return [];
  }
};

// create alert
const createAlert = (type, message) => {
  return `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        <p class="m-0">${message}</p>
     </div>
    `;
};

// check submite value is number or not
const isNumber = (number) => {
  const partran = /^[0-9]{1,}$/;
  return partran.test(number);
};

// time ago function
function timeAgo(timestamp) {
  const currentTimestamp = Date.now();
  const timeDifference = currentTimestamp - timestamp;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years >= 1) {
    return years === 1 ? "1 year ago" : `${years} years ago`;
  } else if (months >= 1) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else if (weeks >= 1) {
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  } else if (days >= 1) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours >= 1) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes >= 1) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  }
}

// genarate unique random identifier
const getRandomUniqueID = (length = 10) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const cryptoObj = window.crypto || window.msCrypto; // For browser compatibility

  if (!cryptoObj || !cryptoObj.getRandomValues) {
    throw new Error("Your browser does not support secure random number generation.");
  }

  const randomArray = new Uint32Array(length);
  cryptoObj.getRandomValues(randomArray);

  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset[randomArray[i] % charset.length];
  }

  return result;
};









// get gpa and gread 

const getGpaGrade = (marks) => {
  let gpa;
  let grade;

  if (marks >= 0 && marks < 33) {
    gpa = 0;
    grade = "F";
  } else if (marks >= 33 && marks < 40) {
    gpa = 1;
    grade = "D";
  } else if (marks >= 40 && marks < 50) {
    gpa = 2;
    grade = "C";
  } else if (marks >= 50 && marks < 60) {
    gpa = 3;
    grade = "B";
  } else if (marks >= 60 && marks < 70) {
    gpa = 3.5;
    grade = "A-";
  } else if (marks >= 70 && marks < 80) {
    gpa = 4;
    grade = "A";
  } else if (marks >= 80 && marks <= 100) {
    gpa = 5;
    grade = "A+";
  }
  return {
    gpa: gpa,
    grade: grade,
  };
};

const getFinalResult = (marks) => {
  let cgpa;
  let result;

  let totalGpa =
    getGpaGrade(marks.bangla).gpa +
    getGpaGrade(marks.english).gpa +
    getGpaGrade(marks.math).gpa +
    getGpaGrade(marks.science).gpa +
    getGpaGrade(marks.social_science).gpa +
    getGpaGrade(marks.religion).gpa;

  cgpa = totalGpa / 6;

  if (
    marks.bangla >= 33 &&
    marks.english >= 33 &&
    marks.math >= 33 &&
    marks.science >= 33 &&
    marks.social_science >= 33 &&
    marks.religion >= 33
  ) {
    if (cgpa >= 1 && cgpa < 2) {
      result = "D";
    } else if (cgpa >= 2 && cgpa < 3) {
      result = "C";
    } else if (cgpa >= 3 && cgpa < 3.5) {
      result = "B";
    } else if (cgpa >= 3.5 && cgpa < 4) {
      result = "A-";
    } else if (cgpa >= 4 && cgpa < 5) {
      result = "A";
    } else if (cgpa >= 5) {
      result = "A+";
    }

    return {
      result: result,
      cgpa: cgpa,
    };
  } else {
    return {
      result: "F",
      cgpa: cgpa,
    };
  }
};








