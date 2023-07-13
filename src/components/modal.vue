	<template>
		<div>
		<div id="myModal" v-show="affiche" class="myModal">
			<div class="myModal-content">
			<span class="close" id="close" @click="closeModal">&times;</span>
			<div class="container">
				<h2 class="form">{{ titre }}</h2>
				<input name="num" id="num" type="text" v-model="employe.numemp" class="form-control" hidden autofocus><br>
				<label for="nom" class="col-from-label">Nom:</label>
				<input name="nom" id="nom" type="text" v-model="employe.nom" class="form-control"><br>
				<label for="salaire" class="col-from-label">Salaire:</label>
				<input name="salaire" id="salaire" type="number" v-model="employe.salaire" class="form-control" step="500"><br>
				<button class="btn btn-primary" @click="enregistrerEmploye(type)">Enregistrer</button>
				<button class="btn btn-secondary" @click="annuler(type)">Annuler</button>
			</div>
			</div>
		</div>
		</div>
	</template>
	
	<script>
	import Swal from 'sweetalert2';
	import axios from 'axios';
	
	export default {
		props: {
		employe: {
			type: Object,
		},
		affiche: {
			type: Boolean,
			required: true
		},
		type: {
			type: String,
			required: true
		}
		},
		computed: {
			titre() {
				if (this.type === 'add'){
					return  "Ajout d'un employé"
				}else
				return  "Modification d'un employé";
			}
		},
		methods: {
		closeModal() {
			this.$emit('close-modal');
		},
		enregistrerEmploye(type) {
			const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-success',
				cancelButton: 'btn btn-danger'
			},
			buttonsStyling: false
			});
			let id = this.employe.numemp;
			let nom = this.employe.nom;
			let salaire = this.employe.salaire;
	
			if (nom === '' || salaire === '' || salaire < 0) {
			swalWithBootstrapButtons.fire(
				'Erreur de saisie',
				'Verifier votre saisie',
				'error'
			);
			} else {
			if (type === 'add') {
				axios.post('http://localhost:3300/api/employes?id=' + id + '&nom=' + nom + '&salaire=' + salaire)
				.then(response => {
					this.$emit('employe-added');
					swalWithBootstrapButtons.fire(
					'Ajouté',
					nom + ' ajouté avec succès',
					'success'
					);
					
					this.$emit('close-modal');
				})
				.catch(error => {
					swalWithBootstrapButtons.fire(
					'Erreur lors de l\'ajout de l\'employé',
					error,
					'error'
					);
				});
			} else if (type === 'update') {
				axios.put('http://localhost:3300/api/employes/' + id + '?&nom=' + nom + '&salaire=' + salaire)
				.then(response => {
					swalWithBootstrapButtons.fire(
					'Modifié',
					nom + ' modifié avec succès',
					'success'
					);
					this.$emit('employe-updated');
					this.$emit('close-modal');
				})
				.catch(error => {
					swalWithBootstrapButtons.fire(
					'Erreur lors de la mise à jour de l\'employé',
					error,
					'error'
					);
				});
			}
			}
		},
		annuler(type) {
			if (type == 'update') {
			this.$emit('close-modal');
			} else {
			this.employe.nom = '';
			this.employe.salaire = '';
			}
		}
		}
	};
	</script>
	