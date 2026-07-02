import {getUser,logout,fetchWithAuth} from "../auth.js";

const initDashboard= async ()=>{
 const expenses=await getExpense();
await greet();
renderExpenses(expenses);
renderChart(expenses);
attachEvents();

}

const greet=async()=>{
    const user=await getUser();
    if(!user){
        return;
    }
    document.getElementById("greet").innerHTML="Welcome back 👋"+user.name +"<br>"+user.email;
};

const objectToQuery=(filters={})=>{
 let query="";
 for(const key in filters){
    query+=`${key}=${filters[key]}&`;
 }
 return query.slice(0,-1);
}

const getFilters=()=>{
   const category=document.getElementById("filterCategory").value;
  
   return  {category};
}

const getExpense=async()=>{
let query=objectToQuery(getFilters());
const url=query?`expense/getExpenses?${query}`:`expense/getExpenses`;
 const res=await fetchWithAuth(url);
 if(!res.ok){
    return null
 }
 return res.json();
}

const timeStampTodate=(t)=>{
return new Date(t).toISOString().split("T")[0]
}

const getUniqueDays=(expenses)=>{
const uniqueObjects=expenses.filter((obj1,i)=>{
    return i== expenses.findIndex(obj2=> {
        return timeStampTodate(obj1.date)===timeStampTodate(obj2.date)})
})
const uniquedays=uniqueObjects.map(e => timeStampTodate(e.date));
return uniquedays;
}

 const renderChart=(expenses)=>{
    const canvas = document.getElementById("myChart");
   if (canvas.chart) {
    canvas.chart.destroy();
}
    
    const category=["Food","Transport","Shopping","Bills","Entertainment","Other"];
    const dates=getUniqueDays(expenses);
    const amount=category.map( c=>{
        return expenses.filter(e =>c ===e.category)
               .reduce((a,c)=>a+c.amount,0)
});
 
    const data = {
    labels: category,
    datasets: [{
        label: "Expenses by Category",
        data: amount,
        backgroundColor: "pink"
    }]
};

canvas.chart = new Chart(canvas, {
    type: "bar",
    data,
    options: {
        responsive: false
    }
});
 }

const renderExpenses =(expenses)=>{
const app=document.getElementById("app");
app.innerHTML="";
if(!expenses||expenses.length==0){
app.innerHTML="no expenses found";
return
}
console.log(expenses);

app.innerHTML=expenses.map((e)=>{
    const date=new Date(e.date).toISOString().split("T")[0];
    let card= `<div class="expenseCard" 
    id="${e._id}"
    data-title="${e.title}"
    data-amount="${e.amount}"
    data-category="${e.category}"
    >
    ${e.title} - ${e.amount} - ${date} - ${e.category}
    <button class="editButton">EDIT</button>
    <button class="deleteButton">DELETE</button>
    </div> `;
    return card;
   
}).join("");
};

const attachFilterdRender=()=>{
    document.getElementById("filterCategory").addEventListener("change",async()=>{
        const expenses=await getExpense();
        renderExpenses(expenses);
        renderChart(expenses);
    })
}
const addExpense=async (expense)=>{
const res=await fetchWithAuth("expense/createExpense",{
    method:"POST",
    headers:{
        "Content-Type":"application/json",
    },
    body:JSON.stringify(expense)
})
if(!res.ok){
    throw new Error("expense adding failed");
}
const data=await res.json();
return data;
}

const attachLogout=()=>{
document.getElementById("logout").addEventListener("click",logout);
}

const attachAddExpense=()=>{
    const addBtn = document.getElementById("addExpense");
addBtn.addEventListener("click", async () => {
    const title = document.getElementById("title").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    if(!title ||!amount ||!category){
        return;
    }
const expense={title,amount,category};
try{
const res=await addExpense(expense);
const expenses = await getExpense();
renderExpenses(expenses);
renderChart(expenses);
}
catch(err){
console.log(err.message);
}
});
}

const deleteExpense=async(id)=>{
try{
const res=await fetchWithAuth(`expense/deleteExpense/${id}`,{
    method:"DELETE",
    headers:{
        "Content-Type":"application/json",
    }
})
 if(!res.ok){
        throw new Error("Failed to delete");
    }
}
catch(err){
console.log(err.message);
}
}

const getNewExpense=()=>{
const title=document.getElementById("editTitle").value;
const amount=document.getElementById("editAmount").value;
const category=document.getElementById("editCategory").value;
if(!title ||!amount||!category){
    console.log("all fields required");
    return null;
}
return {title,amount,category};
}

const closeModel=()=>{
    document.getElementById("editModal").classList.add("hidden");
}
const openModel=(id,title,amount,category)=>{
    document.getElementById("editModal").dataset.id=id;
    document.getElementById("editModal").classList.remove("hidden");
    document.getElementById("editTitle").value=title;
    document.getElementById("editAmount").value=amount;
    document.getElementById("editCategory").value=category;


}
const saveExpense =async(id)=>{
const newExpense=getNewExpense();
if(!newExpense){return}
try{
const res=await fetchWithAuth(`expense/editExpense/${id}`,{
    method:"PUT",
    headers:{
        "Content-Type" :"application/json",
    },
    body:JSON.stringify(newExpense)
})
if(!res.ok){
    throw new Error("failed to update");
} 
const updatedExpense=await res.json(); 
console.log(updatedExpense);
closeModel();
const expense=await getExpense();
renderExpenses(expense);
renderChart(expense);
}
catch(err){
    console.log(err.message);
}
}

const attachModelActionButton=()=>{
   document.getElementById("closeModal").addEventListener("click",(e)=>{
    console.log("cancel");
    closeModel();
   })

   document.getElementById("saveEdit").addEventListener("click",async(e)=>{
   const id= document.getElementById("editModal").dataset.id;
    try{
    await saveExpense(id);
    console.log("saved");
    }
    catch(err){
  console.log(err.message);
    }
   })
}

const editExpense=(id)=>{
const card=document.getElementById(id);
const title=card.dataset.title;
const amount=card.dataset.amount;
const category=card.dataset.category;
openModel(id,title,amount,category);
}


const attachActionButton=()=>{
let container=document.getElementById("app");
container.addEventListener("click",async(e)=>{
const id=e.target.parentElement.id;
if(e.target.classList.contains("deleteButton")){
    console.log("deeeel");
await deleteExpense(id);
const expense=await getExpense();
renderExpenses(expense);
renderChart(expense);
}
if(e.target.classList.contains("editButton")){
    console.log("edddd");
editExpense(id);
}
})
}



const attachEvents= ()=>{
attachLogout();
attachAddExpense();
attachActionButton();
attachModelActionButton();
attachFilterdRender();
}

initDashboard();