import http from 'node:http'
import { URL } from 'node:url'
const porta = 3000

const tarefas = [
    {id: 1, titulo : 'lavar louças'},
    {id: 2, titulo : 'Comprar uma RTX 5090'}
]

const server = http.createServer((requisicao, resposta) => {
    resposta.setHeader('Content-Type', 'application/json; charset=utf-8')


const urlObj = new URL (requisicao.url, `http://${requisicao.headers.host}`);

if(requisicao.method == 'GET' && requisicao.url  == '/tarefas'){
    resposta.statusCode = 200
    resposta.end(JSON.stringify(tarefas))
} else if(requisicao.method == 'GET' &&  urlObj.pathname == '/tarefas/busca'){
    const titulo = urlObj.searchParams.get('titulo');
    const resultado = tarefas.filter(tarefa => tarefa.título == titulo);
    resposta.statusCode = 200;
    resposta.end(JSON.stringify(resultado));
}

else if (requisicao.method == 'DELETE' && urlObj.pathname == '/tarefas') {

    const index = urlObj.searchParams.get('index');
    const tarefaremovida = tarefas.splice(index, 1);
    resposta.statusCode = 200;
    resposta.end(JSON.stringify(tarefas));

} else if (requisicao.method == 'POST' && requisicao.url == '/tarefas'){
 let body = ''

requisicao.on('data', (chunk) => {
    body += chunk.toString()
})
requisicao.on('end', () => {
  
  
    try{
    const novaTarefa =  JSON.parse(body)
        if(!novaTarefa.titulo){
            resposta.end(JSONl.stringify({error: 'O campo "título" é obrigatório.'}))
        }
        const tarefaCriada = {
            id: tarefas.length + 1,
            titulo: novaTarefa.titulo
        }

        tarefas.push(tarefaCriada)

        resposta.statusCode = 201
        resposta.end(JSON.stringify(tarefaCriada))
        
    } catch(error){
    resposta.statusCode = 400
    resposta.end(JSON.stringify({error : 'formato JSON inválido!'}));
  
  } 

})
} else {
    resposta.statusCode = 400
    resposta.end(JSON.stringify ({error: 'Página não encontrada.'}))
}


});

server.listen(porta, () => {
    console.log(`Servidor funcionando na porta ${porta}`);
});


//questao3
// Sim, tá adequado. Se mandar um JSON errado,
 //o código pega o erro e avisa que o formato do 
 //JSON é inválido, então fica fácil entender o que aconteceu.