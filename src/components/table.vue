  <template>
    <div>
      <button class="btn btn-success" id="group1" @click="openAddForm()">
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
        <path fill="currentColor" fill-rule="evenodd" d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0Zm0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5H8Z" clip-rule="evenodd"/>
      </svg>
      Ajouter
    </button>
      <Modal :employe="employeModal" :affiche="afficheModal" :type="modalType" @close-modal="closeModal" @employe-added="loadEmployes" @employe-updated="loadEmployes" />
      <table id="tableEmploye" class="table table-dark table-striped" style="width: 100%; margin-top: 2rem;">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nom</th>
            <th scope="col">Salaire</th>
            <th scope="col">Obs</th>
            <th scope="col" id="action">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employe in employes" :key="employe.numemp">
            <td>{{ employe.numemp }}</td>
            <td>{{ employe.nom }}</td>
            <td>{{ employe.salaire }}</td>
            <td>{{ obs(employe.salaire) }}</td>
            <td>
              <button class="btn btnEdit" id="btnEdit" @click="openUpdateForm(employe)">
                <svg id="editIcon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                  <path fill="currentColor" d="m18.988 2.012l3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287l-3-3L8 13z"/>
                  <path fill="currentColor" d="M19 19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2V19z"/>
                </svg>
              </button>
              <button class="btn btnDelete" id="btnDelete" @click="openConfirm(employe)">
                <svg id="deleteIcon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>

  <script>
  import Swal from 'sweetalert2';
  import axios from 'axios';
  import Modal from './modal.vue';
  

  export default {
    data() {
      return {
        employeModal: {
          id: '',
          nom: '',
          salaire: ''
        },
        afficheModal: false,
        modalType:"",
        employes: []
      };
    },
    methods: {
      closeModal() {
        this.afficheModal = false;
      },
      openAddForm() {
        this.afficheModal = true;
        this.modalType='add'
        this.employeModal= {
           id: '',
            nom: '',
            salaire: ''
         }
     },
      openUpdateForm(employe) {
        this.afficheModal = true;
        this.modalType= 'update',
        this.employeModal = { ...employe };
        
      },
      obs(salaire) {
        if (salaire < 1000) {
          return 'médiocre';
        } else if (salaire < 5000 && salaire >= 1000) {
          return 'moyen';
        } else {
          return 'élevé';
        }
      },
      openConfirm(employe) {
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
          title: 'Action irréversible',
          text: "Êtes-vous sûr de vouloir supprimer " + employe.nom + " ?",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'NON',
          confirmButtonText: 'OUI, SUPPRIMER',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            axios.delete('http://localhost:3300/api/employes/' + employe.numemp)
              .then(() => {
                swalWithBootstrapButtons.fire(
                  'Supprimé !',
                  employe.nom + ' supprimé avec succès',
                  'success'
                );
                this.loadEmployes();
              })
              .catch(() => {
                swalWithBootstrapButtons.fire(
                  'Erreur',
                  'Une erreur s\'est produite lors de la suppression',
                  'error'
                );
              });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
              'Annulé',
              'Suppression annulée',
              'error'
            );
          }
        });
      },
      loadEmployes() {
        axios.get('http://localhost:3300/api/table')
          .then(response => {
            this.employes = response.data;
          });
      }
    },
    mounted() {
      this.loadEmployes();
    },
    components: {
      Modal
    }
  };
  </script>
