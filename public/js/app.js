import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded',()=>{

    //Clean alerts
    let alerts  = document.querySelector('.alertas');
    if(alerts){
        cleanAlerts();
    }

    const skills = document.querySelector('.lista-conocimientos');
    if(skills){
        skills.addEventListener('click', addSkills);
    }

    // call a function when we are editing
    selectedSkills();

    const positionsList = document.querySelector('.panel-administracion');

    
    if(positionsList){
        positionsList.addEventListener('click',listAccions)
    }
})


const cleanAlerts = () =>{
    const alerts = document.querySelector('.alertas')
    const interval = setInterval(()=>{
        if(alerts.children.length > 0){
            alerts.removeChild(alerts.children[0]);
        }else if(alerts.children.length === 0 ){
            alerts.parentElement.removeChild(alerts);
            clearInterval(interval)
        }
    },2000);
}

const skills = new Set();
const addSkills = e =>{
    if(e.target.tagName === 'LI'){
        if(e.target.classList.contains('activo')){
            skills.delete(e.target.textContent)
            e.target.classList.remove('activo')
        }else{
            skills.add(e.target.textContent)
            e.target.classList.add('activo')
        }
    }

    const skillsArray = [...skills]
    document.querySelector('#skills').value = skillsArray
    
}

const selectedSkills = () =>{
    const selected = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));

    selected.forEach(selected =>{
        skills.add(selected.textContent)
    })

    const skillsArray = [...skills]
    if(skillsArray.length>0){
        document.querySelector('#skills').value = skillsArray
    }
}

const listAccions = e =>{
    e.preventDefault();
    if(e.target.dataset.delete){
        // delete with axios
        
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {

            // send petition with axios
            const url = `${location.origin}/positions/delete/${e.target.dataset.delete}`;

            axios.delete(url,{params: {url}})
                .then(function(response){
                    if(response.status === 200){
                          Swal.fire(
                            'Deleted!',
                            response.data,
                            'success'
                          )
                    };
                    e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement)
                })
                .catch((e)=>{
                    Swal.fire({
                        type:'error',
                        title: 'An error ocured',
                        text: 'Was not deleted'
                    })
                })
            }
          })
    }else if(e.target.tagName ==='A'){
        window.location.href = e.target.href
    }
}