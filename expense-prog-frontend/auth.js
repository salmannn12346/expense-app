function getToken(){
    return localStorage.getItem("token");
}
function setToken(token){
    localStorage.setItem("token",token);
}
async function removeToken(){
    localStorage.removeItem("token");

}
async function refreshToken(){
    
    const res=await fetch("http://localhost:3000/auth/refresh",{
        method:"POST",
        credentials:"include"
    });
if(!res.ok){
    throw new Error("refresh failed");
}
const data = await res.json();
setToken(data.token);
return data.token;
}


export const fetchWithAuth=async (url,options={})=>{
    const token =getToken();
    let res=await fetch(`http://localhost:3000/${url}`,{
        ...options,
        headers:{
            ...(options.headers|| {}),
            Authorization :`Bearer ${token}`
        }
    })
    if(res.status===401){
        try{
            const newToken=await refreshToken();
           res=await fetch(`http://localhost:3000/${url}`,{
        ...options,
        headers:{
            ...(options.headers|| {}),
            Authorization :`Bearer ${newToken}`
        }
    })
        }
        catch(err){
        logout();
        return;
        }
        
    }
    return res;
    }


 export const logout=async ()=>{
  await fetch("http://localhost:3000/auth/logout",{
    method:"POST",
    credentials:"include"
  });
  removeToken();
  window.location.href="/login.html";
}

export const getUser=async()=>{
 const res=await fetchWithAuth("auth/me");
 if(!res){
    return null
 }
 return res.json();
}
export const getExpense=async()=>{
 const res=await fetchWithAuth("expense/getExpenses");
 if(!res){
    return null
 }
 return res.json();
}
    
