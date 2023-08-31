import React,{useEffect, useState} from 'react'
import './Profile.css';
import axios from 'axios';
import { CSVLink } from 'react-csv';
export default function Profile(props) {
 const[price,setPrice]=useState(0);
 
  const[data,setData]=useState({
    date:'',
    category:'',
   description:'',
   amount:''

});

  const[listData,setListData]=useState([]);

  let {date,category,description,amount}=data;
  function listHandler(e){
    e.preventDefault();
    fetch(`https://expence-tracker-c3991-default-rtdb.firebaseio.com/expense.json`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
   
    
        setListData([...listData, {date,category,description,amount}]);
      setData({date:'',category:'',description:'',amount:''});
        }

function handle(e){
  let name=e.target.name;
  let value=e.target.value;
  setData({...data,[name]:value})
  }
  
  
      
  useEffect(() => {
    axios.get(`https://expence-tracker-c3991-default-rtdb.firebaseio.com/expense.json`)
    .then((response) => {
          
          const post=[];
          for(let key in response.data){
              post.push({...response.data[key],id:key})
          }
          
          setListData([...post])
        })
      .catch((error) => {
          console.error('Fetch error:', error);
        });
    },[])
     
    const handlePrice = ()=>{
      let ans = 0;
      listData.map((item)=>(
          ans += parseInt(item.amount )
      ))
      setPrice(ans);
      if(ans>10000){
        alert("Buy premium")
       
      }
  }
  
  useEffect(()=>{
    handlePrice();
})
    
    
    const remove=(id)=>{
      fetch(`https://expence-tracker-c3991-default-rtdb.firebaseio.com/expense/${id}.json`, {
        method: "DELETE",
      })
      const arr = listData.filter((item)=>item.id !== id);
      setListData(arr);
    }

    
   
  return (
    <div>
      
        <h1>Day To Day Expense</h1>
       
      <div className='total'>
          <span><h4>Total Expense:</h4></span>
            <span><h4>Rs.{price}</h4></span>
        </div>
        <CSVLink data={listData}>download</CSVLink>
      <hr></hr>
     
        <div id="form" >
              <div className='new-expense__controls'>
                   <div className='new-expense__control'>
                   <label>Category: </label>
                  <select type='select' value={data.category} name='category' onChange={handle}>
                  <option value="select">Select</option>
                   <option value="Bills and EMI's">Bills and EMI's</option>
                    <option value="Sports">Sports</option>
                     <option value="Travel">Travel</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Books and Education">Books and Education</option>
                    <option value="Home,Furniture and Appliances">Home,Furniture and Appliances</option>
                    <option value="Others">Others</option>
                    </select>
                    <label>Amount: </label>
                    <input type='number' value={data.amount} name='amount' onChange={handle}></input>
                   </div>
                   <div className='new-expense__control'>
                    <label>Description: </label>
                    <input type='text' value={data.description} name='description' onChange={handle}></input>
                   </div>
                   <div className='new-expense__control'>
                    <label>Date: </label>
                    <input type='date' min="2019-1-1" max="2023-12-31" value={data.date} name='date' onChange={handle}></input>
                   </div>
                   <div className='new-expense__control'>
                 <input type='button' className="data" value="Add Expense" onClick={listHandler} ></input>
               
                   </div>
                   </div>
              </div>
                <div className='transaction'>
                
              <table>
              <thead>
                <tr className='heading'>
                  <th><h2>Date</h2></th>
                  <th><h2>Category</h2></th>
                  <th><h2>Description</h2></th>
                  <th><h2>Amount</h2></th>
                  </tr>
                </thead>
                <tbody>
                {listData.map((t,i) => (
              t && t.date ? (
                <tr key={i}>
                  <td><h3 className='date'>{t.date}</h3></td>
                  <td><h2>{t.category}</h2></td>
                  <td><p>{t.description}</p></td>
                  <td><p>{t.amount}</p></td>
                  <td><button className='edit'><a href={`/update/${t.id}`} className='aedit'>Edit</a></button></td>
                  <td><button className='delete' onClick={() => remove(t.id)}>Delete</button></td>
                </tr>
              ) : null
            ))}
                </tbody>
              </table>
              
              </div>
             </div>
             )
       }
