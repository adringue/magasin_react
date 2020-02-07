let testArr = [
    {
        name: "ryan",
        hobbies: "fun"
    },
    {
        name: 'Josh',
        hobbies: "farting"
    }
    
]

const results = testArr.map(testItem => {
    console.log(testItem.hobbies)
})

console.log(results)