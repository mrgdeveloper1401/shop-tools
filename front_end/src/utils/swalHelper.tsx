import Swal from 'sweetalert2';

const showSwal = (title: any, text: any, icon: any, confirmButtonText: any) => {
  Swal.fire({ title, text, icon, confirmButtonText });
};

export { showSwal };
