import { ApolloServer, gql } from "apollo-server";
// package.json에 타입 적워줘야 import 문 사용 가능! require말고!

// ``여기에 SDL적어주면 됨!!
// Query는 필수!! GET /text 랑 같은 효과! GET /hello
// 아무것도 아닌 그냥 들어가면 아폴로 스듀디오가 나온다!

// API shape를 만들기
// Scalar type은 grpghql에 내장된 타입들을 의미, String, Boolean, ID등 다양함 

// POST는 mutation임
// DELETE도 mutaiton임 

// !는 null을 용납 안한다는 뜻
// []! 는 []안에 null이 있을수도 있다는거!
// tweet Nullable임
const typeDefs = gql`
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        fullName: String!
    }
    type Tweet {
        id: ID!
        text: String!
        auther: User

    }
    type Query {
        allUsers: [User!]!
       allTweets: [Tweet!]!
       tweet(id: ID!): Tweet
       
    }
    type Mutation {
        postTweet(text: String!, userId: ID!): Tweet
        deleteTweet(id: ID!): Boolean!
    }
`
let users = [
    {
    id: "1",
    firstName: "nico",
    lastName: 'las'
    },
    {
        id: "2",
        firstName: "mask",
        lastName: 'elon'
        },
]

let tweets = [
    {
        id: '1',
        text: 'hello',
        userId: "2"
        
    },
    {
        id: '2',
        text: 'second',
        userId: "1"
        
    },
]

// movie/:id

// resolver를 만들기 위해 js코드를 작성할 예정!
// 하나의 객체가 될 예정 , 타입 정의와 같은 형태를 가짐
// apollo는 누군가 쿼리의 트윗을 요청하는 것을 본다면
// resolver의 쿼리로 갈거고 이 함수를 실행!
// 누군가 필드를 요청하면 실제로 불린다!

// root, args
// filter사용하면 하나만 가져오는게 아니어서 렉걸림
// memory에 저장되는거여서 새로 고침하면 사라짐!

const resolvers = {
    Query: {
        allUsers() {
            console.log('all user')
            return users
        },
        allTweets() {
            return tweets
        },

        tweet(root, {id}){
            console.log(id)
            return tweets.find((tweet)=> tweet.id ===id)

        },

    },
    Mutation: {
        postTweet(_,{text,userId} ) {
            const newTweet = {
                id: tweets.length +1,
                text,
                userId

            }
            const check = users.find((user)=> user.id === userId)
            if (!check) {
                return
            }else{
                tweets.push(newTweet)
            }
           
            tweets.push(newTweet)
            return newTweet
        },
        deleteTweet(_, {id}) {
            
            const delTweet = tweets.find((tweet)=> tweet.id ===id)
            if (!delTweet) return false
            tweets = tweets.filter((tweet) => tweet.id !== id)
            return true
            
        }
    },
    // type resolver로 조금 다름!
    User: {
        fullName({firstName, lastName}) {
            console.log('user')
           // console.log(root)
            return `${firstName} ${lastName}`
        }
    },
    Tweet: {
        auther({userId}) {
            return users.find((user)=> user.id === userId)
        }
    }
}
// alluser가 먼저 호출 그리고 거기 data 가지고 난 후 full Name field없다는걸 캐치
// 그래서 그래프 ql은 리졸버를 뒤지다가 User 리졸버 실행!

// root arguments에는 fullName을 호출하는
// roo를 가져오면 fullName을 호출하는 User를 볼수있음
// query에 allUser로 감 -> 그리고 두개의 user가있으니까 각각 호출함!
// 그리고 각각 리졸버를 찾아냄

const server = new ApolloServer({typeDefs, resolvers})
server.listen().then(({url}) => {
    console.log(`Runing on ${url}`)
    //graphql이 data의 shape을 미리 알고 있어야한다!
    // 많은 type들의 집합이다!
})