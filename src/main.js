const student_create_form = document.querySelector("#student_create_form");
const add_result_form = document.querySelector("#add_result_form");
const edit_result_form = document.querySelector("#edit_result_form");
const student_edite_form = document.querySelector("#student_edite_form");
const add_student_modal_close = document.querySelector("#add_student_modal_close");
const edite_student_modal_close = document.querySelector("#edite_student_modal_close");
const photo = document.querySelector(".photo");
const photo_preview = document.querySelector(".photo_preview");
const msg = document.querySelector(".msg");
const all_student_data = document.querySelector(".all-students-data");
const single_student_container = document.querySelector(".single_student_container");

// profile photo preview
photo.onchange = (e) => {
  if (photo) {
    photo_preview.innerHTML = ` <img class="img-thumbnail mt-3 w-100" src="${e.target.value}" >`;
  }
};

// show data on dashboard student list
const showData = () => {
  const students = getData("students");
  let content = "";
  if (students.length > 0) {
    students.map((student, index) => {
      content += `
          <tr class="align-middle">
            <td>${index < 9 ? `0${index + 1}` : index + 1}</td>
            <td><img style="width: 60px; object-fit: cover" class="rounded" src="${student.photo}" alt="${student.name}" /></td>
            <td>${student.name}</td>
            <td>${student.roll}</td>
            <td>${student.reg}</td>
            <td>${timeAgo(student.time)}</td>
            <td>
            ${
              student.result === null
                ? `<button class="btn btn-sm btn-success" data-bs-toggle="modal" data-bs-target="#add_result_modal" onclick="addResult('${student.id}')">Add result</button>`
                : `<button class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#edit_result_modal" onclick="eidteResult('${student.id}')">Edit result</button>`
            }
          </td>
          
            <td>
            <button class="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target="#show_single_student_modal" onclick="show_student_single_data('${
              student.roll
            }')">
                <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-warning" data-bs-toggle="modal"  data-bs-target="#edite_student_modal" onclick = "editeStudent('${student.id}')">
                <i class="fa-solid fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick = "deleteStudent('${student.roll}')">
                <i class="fa-solid fa-trash"></i>
            </button>
            </td>
         </tr> 
        `;
    });
  } else {
    content = `
        <tr>
            <td colspan="8" class="text-center bg-danger-subtle">No data found</td>
        </tr>
    `;
  }

  all_student_data.innerHTML = content;
};
showData();

// submite student data and send it to the local storage
student_create_form.onsubmit = (e) => {
  e.preventDefault();

  const from_data = new FormData(e.target);
  const data = Object.fromEntries(from_data);
  if (!data.name || !data.roll || !data.reg) {
    msg.innerHTML = createAlert("danger", "All fields are required");
  } else if (!isNumber(data.roll)) {
    msg.innerHTML = createAlert("danger", "Roll number must be a number");
  } else if (!isNumber(data.reg)) {
    msg.innerHTML = createAlert("danger", "Registration number must be a number");
  } else if (data.roll.length !== 6 || data.roll.length < 6) {
    msg.innerHTML = createAlert("danger", "Roll number must be 6 characters.");
  } else if (data.reg.length !== 8 || data.reg.length < 8) {
    msg.innerHTML = createAlert("danger", "Reg number must be 8 characters.");
  } else {
    const old_student = getData("students");

    // check roll and registetion number exsist or not
    if (old_student.some((item) => item.roll === data.roll)) {
      msg.innerHTML = createAlert("danger", ` This Roll <b>( ${data.roll} ) </b> already exists`);
    } else if (old_student.some((item) => item.reg === data.reg)) {
      msg.innerHTML = createAlert("danger", ` This Reg No <b>( ${data.reg} ) </b> already exists`);
    } else {
      old_student.push({
        ...data,
        result: null,
        time: Date.now(),
        id: getRandomUniqueID(10),
      });

      setData("students", old_student);
      showData();
      setTimeout(() => {
        add_student_modal_close.click();
      }, 2000);
      e.target.reset();
      photo_preview.innerHTML = "";
    }
  }
};

// Reset form data
student_create_form.querySelector(".reset").onclick = () => {
  student_create_form.reset();
  student_create_form.querySelector(".photo_preview").innerHTML = "";
  msg.innerHTML = "";
};

// add result
const addResult = (id) => {
  add_result_form.querySelector('input[name="id').value = id;
};

add_result_form.onsubmit = (e) => {
  e.preventDefault();
  const form_data = new FormData(e.target);
  const data = Object.fromEntries(form_data);
  const new_data = { ...data };
  delete new_data.id;

  //  get old data form local storage
  const old_student_data = getData("students");
  old_student_data[old_student_data.findIndex((old_data) => old_data.id === data.id)] = {
    ...old_student_data[old_student_data.findIndex((old_data) => old_data.id === data.id)],
    result: new_data,
  };
  add_result_form.previousElementSibling.innerHTML = createAlert("success", `Result Added successfull`);
  setData("students", old_student_data);
  showData();
  e.target.reset();
};

// // edite result and update result
const eidteResult = (id) => {
  const old_students_data = getData("students");
  const single_student_data = old_students_data.find((old_data) => old_data.id === id);
  edit_result_form.querySelector('input[name="bangla"]').value = single_student_data.result.bangla;
  edit_result_form.querySelector('input[name="english"]').value = single_student_data.result.english;
  edit_result_form.querySelector('input[name="math"]').value = single_student_data.result.math;
  edit_result_form.querySelector('input[name="science"]').value = single_student_data.result.science;
  edit_result_form.querySelector('input[name="social_science"]').value = single_student_data.result.social_science;
  edit_result_form.querySelector('input[name="religion"]').value = single_student_data.result.religion;
  edit_result_form.querySelector('input[name="id"]').value = id;
};

edit_result_form.onsubmit = (e) => {
  e.preventDefault();
  const form_data = new FormData(e.target);
  const data = Object.fromEntries(form_data);

  const new_data = { ...data };
  delete new_data.id;

  let old_students_data = getData("students");
  old_students_data[old_students_data.findIndex((old_data) => old_data.id === data.id)] = {
    ...old_students_data[old_students_data.findIndex((old_data) => old_data.id === data.id)],
    result: new_data,
  };
  console.log(new_data);
  edit_result_form.previousElementSibling.innerHTML = createAlert("success", `Result Update successfull`);
  setData("students", old_students_data);
  showData();
};

// eidte student data
const editeStudent = (id) => {
  const students = getData("students");
  const single_student = students.find((data) => data.id === id);
  student_edite_form.querySelector('input[name="name"]').value = single_student.name;
  student_edite_form.querySelector('input[name="roll"]').value = single_student.roll;
  student_edite_form.querySelector('input[name="reg"]').value = single_student.reg;
  student_edite_form.querySelector('input[name="photo"]').value = single_student.photo;
  student_edite_form.querySelector('input[name="id"]').value = single_student.id;

  // profile photo preview
  const photo_preview = student_edite_form.querySelector(".photo_preview");
  const photo = student_edite_form.querySelector(".photo");

  photo_preview.innerHTML = ` <img class="img-thumbnail mt-3 w-100" src="${single_student.photo}" > `;
  photo.onkeyup = (e) => {
    if (photo.value.length > 0) {
      photo_preview.innerHTML = ` <img class="img-thumbnail mt-3 w-100" src="${e.target.value}" > `;
    } else {
      photo_preview.innerHTML = " ";
    }
  };
};

//  submit edite sutdetn data
student_edite_form.onsubmit = (e) => {
  e.preventDefault();
  const from_data = new FormData(e.target);
  const data = Object.fromEntries(from_data);

  if (!data.name || !data.roll || !data.reg) {
    student_edite_form.previousElementSibling.innerHTML = createAlert("danger", "All fields are required");
  } else if (!isNumber(data.roll)) {
    student_edite_form.previousElementSibling.innerHTML = createAlert("danger", "Roll number must be a number");
  } else if (!isNumber(data.reg)) {
    student_edite_form.previousElementSibling.innerHTML = createAlert("danger", "Registration number must be a number");
  } else if (data.roll.length !== 6 || data.roll.length < 6) {
    student_edite_form.previousElementSibling.innerHTML = createAlert("danger", "Roll number must be 6 characters.");
  } else if (data.reg.length !== 8 || data.reg.length < 8) {
    student_edite_form.previousElementSibling.innerHTML = createAlert("danger", "Reg number must be 8 characters.");
  } else {
    // get old students data from local storage and replace with new student edite data
    const old_students_data = getData("students");

    old_students_data[old_students_data.findIndex((old_data) => old_data.id === data.id)] = {
      ...old_students_data[old_students_data.findIndex((old_data) => old_data.id === data.id)],
      ...data,
    };

    student_edite_form.previousElementSibling.innerHTML = createAlert("success", ` ( ${data.name} )  Data update successfull`);
    setData("students", old_students_data);
    showData();
    // auto modal close
    setTimeout(() => {
      edite_student_modal_close.click();
    }, 2000);
  }
};

// delete student from ls list
const deleteStudent = (roll) => {
  const conf = confirm("Are you sure, you want to delete this student from the ls list");
  if (conf) {
    const students = getData("students");
    const update_students = students.filter((data) => data.roll !== roll);
    setData("students", update_students);
    showData();
  } else {
    alert("Your data is safe");
  }
};

// show induvisual student data
const show_student_single_data = (roll) => {
  const students = getData("students");
  const studentResult = students.find((item) => item.roll === roll );
 


  single_student_container.innerHTML = `
  <div class="for_print_section">
  <div class="card my-4 mt-5">
  <div class="card-body student-result-sheet">
    <div class="student-info">
 
    <div class="row">
    <div class="col-lg-3"> 
      <img style="width:200px; height:160px; object-fit:cover;" src="${studentResult.photo}" />
      <h3 class="mt-3">${studentResult.name}</h3>
      <p class="m-0">Roll : ${studentResult.roll} | Reg: ${studentResult.reg}</p>
    </div>
   
    <div class="col-lg-9"> 
      <div class="result_status text-end" >
      ${
        getFinalResult({
          bangla: studentResult.result.bangla,
          english: studentResult.result.english,
          math: studentResult.result.math,
          science: studentResult.result.science,
          social_science: studentResult.result.social_science,
          religion: studentResult.result.religion,
        }).result === "F"
          ? '<h2 style="color:red; font-size:20px;">Failed</h2>'
          : '<h2 style="color:green; font-size:20px;">Passed</h2>'
      }
      </div>
     
    </div>
  </div>

  <hr />
  <table class="table table-bordered">
    <tr>
      <td>Subject</td>
      <td>Marks</td>
      <td>GPA</td>
      <td>Grade</td>
      <td>CGPA</td>
      <td>Final Result</td>
    </tr>
    <tr>
      <td>Bangla</td>
      <td>${studentResult.result.bangla}</td>
      <td>${getGpaGrade(studentResult.result.bangla).gpa}</td>
      <td>${getGpaGrade(studentResult.result.bangla).grade}</td>
      <td rowspan="6">${getFinalResult({
        bangla: studentResult.result.bangla,
        english: studentResult.result.english,
        math: studentResult.result.math,
        science: studentResult.result.science,
        social_science: studentResult.result.social_science,
        religion: studentResult.result.religion,
      }).cgpa.toFixed(2)}</td>
      <td rowspan="6">${
        getFinalResult({
          bangla: studentResult.result.bangla,
          english: studentResult.result.english,
          math: studentResult.result.math,
          science: studentResult.result.science,
          social_science: studentResult.result.social_science,
          religion: studentResult.result.religion,
        }).result
      }</td>
    </tr>
    <tr>
      <td>English</td>
      <td>${studentResult.result.english}</td>
      <td>${getGpaGrade(studentResult.result.english).gpa}</td>
      <td>${getGpaGrade(studentResult.result.english).grade}</td>
    </tr>
    <tr>
      <td>Math</td>
      <td>${studentResult.result.math}</td>
      <td>${getGpaGrade(studentResult.result.math).gpa}</td>
      <td>${getGpaGrade(studentResult.result.math).grade}</td>
    </tr>
    <tr>
      <td>Science</td>
      <td>${studentResult.result.science}</td>
      <td>${getGpaGrade(studentResult.result.science).gpa}</td>
      <td>${getGpaGrade(studentResult.result.science).grade}</td>
    </tr>
    <tr>
      <td>Social Science</td>
      <td>${studentResult.result.social_science}</td>
      <td>${getGpaGrade(studentResult.result.social_science).gpa}</td>
      <td>${getGpaGrade(studentResult.result.social_science).grade}</td>
    </tr>
    <tr>
      <td>Religion</td>
      <td>${studentResult.result.religion}</td>
      <td>${getGpaGrade(studentResult.result.religion).gpa}</td>
      <td>${getGpaGrade(studentResult.result.religion).grade}</td>
    </tr>
  </table>
</div>
</div>
</div>
</div>

<div class="border rounded-3 p-4 d-flex gap-3">
 <button type="button" class="btn btn-primary px-5" onclick="printMarkSheet()">Print</button> 
 <button type="button" class="btn btn-danger px-5" onclick="try_again()">Try again</button> 
</div>




//   const single_student = students.find((data) => data.roll == roll);
//   single_student_container.innerHTML = `
//   <div class="text-end mb-2"> <button class="btn-close" data-bs-dismiss="modal"></button></div>
 
//   <div class="student-info text-center p-3" style="background:#dddddd80;">
  
  
  
//   <div class="row">
//     <div class="col-lg-3"> 
//      <img class="img-fluid w-100 rounded  " src="${single_student.photo}" alt="${single_student.name}" />
//     </div>
//     <div class="col-lg-9 text-start">
//       <h3 class="h4 m-0">${single_student.name}</h3>
      
//         <span>Roll: ${single_student.roll}</span>
//         <span>Reg: ${single_student.reg}</span>
 
//     </div>
//   </div>


    
    
//  </div>



// <div>
//   <table class="table table-striped border mt-3">
//     <thead class="fw-bold">
//       <tr>
//         <td>Subject</td>
//         <td>Mark</td>
//         <td>GPA</td>
//         <td>Gread</td>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//         <td>Bangla</td>
//         <td>52</td>
//         <td>2.5</td>
//         <td>B</td>
//       </tr>
//       <tr>
//         <td>Bangla</td>
//         <td>52</td>
//         <td>2.5</td>
//         <td>B</td>
//       </tr>
//     </tbody>
//   </table>
// </div>
//   `;
};
