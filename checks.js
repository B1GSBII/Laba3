const lib = require('./index');

const friends = [
    { name: 'Alice', gender: 'Female', age: 25, email: 'alice@example.com' },
    { name: 'Bob', gender: 'Male', age: 30, email: 'bob@example.com' },
    { name: 'Charlie', gender: 'Male', age: 35, email: 'charlie@example.com' },
    { name: 'Diana', gender: 'Female', age: 40, email: 'diana@example.com' }
];

// Test 1
let original = JSON.stringify(friends);
lib.query(friends, lib.select('name'));
console.assert(JSON.stringify(friends) === original, 
    'Test 1 failed: original modified');

// Test 2
let result = lib.query(friends);
console.assert(result !== friends, 
    'Test 2 failed: not a copy');

// Test 3
result = lib.query(friends, lib.select('unknown'));
console.assert(result.every(x => Object.keys(x).length === 0), 
    'Test 3 failed: unknown field not ignored');

// Test 4
result = lib.query(friends, lib.select('name', 'age'), lib.select('age'));
console.assert(result.every(x => Object.keys(x).length === 1 && 'age' in x), 
    'Test 4 failed: intersect select');

// Test 5
result = lib.query(
    friends,
    lib.filterIn('gender', ['Male', 'Female']),
    lib.filterIn('gender', ['Female'])
);
console.assert(result.length === 2 && result.every(x => x.gender === 'Female'), 
    'Test 5 failed: intersect filter');

// Test 6
result = lib.query(friends, lib.filterIn('nickname', ['Bobby']));
console.assert(result.length === 0, 'Test 6 failed: nonexistent field');

// Test 7
result = lib.query(
    friends,
    lib.filterIn('age', [30, 35, 40]),
    lib.select('name', 'age')
);

console.assert(
    result.length === 3 
    && result[0].name === 'Bob' 
    && result[2].name === 'Diana',
    'Test 7 failed: order changed'
);

// Test 8
result = lib.query(friends, lib.select('email'));
console.assert(result.every(x => Object.keys(x).length === 1 && 'email' in x), 
    'Test 8 failed: select only email');

console.log('All extended tests passed!');
