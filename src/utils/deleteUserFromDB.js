// Folosim aceasta functie pt testare, daca nu stergem emailul din bd, 
// nu putem testa ca iese din executie cu exceptia "exista deja in bd(453)" 

const UserService = require('../services/userServices')
UserService.deleteUserByEmail('razvan.boita@student.uaic.ro')