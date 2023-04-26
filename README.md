# Barista

![barista](https://user-images.githubusercontent.com/59893940/214980209-e893f220-ced0-4d8d-97ef-073ed0ec375f.png)

We are proud to finally announce our official partnership with Starbucks coffee. After long talks and intense deliberation we agree that Starbucks baristas all over the country deserve something for themselves. Thats why today we are introducing Barista(trademark pending) a language for the best brewers of the best coffee in the world. Barista is meant to serve as an easy to learn entry into the programming world. It is based on terminology that every starbucks employee is already deeply familiar with. We hope that after Barista there will be one less hurdle for the average barista who loves to program.

### Written by [Troy](https://github.com/troywh), [Berke](https://github.com/berkematthew), [CJ](https://github.com/callencj), [Michail Mavromatis](https://github.com/Xan-22), and [Betram Lalusha](https://github.com/betram-lalusha)

[Checkout the Barista Official Website](https://betramicloud.github.io)

### Features:

- Based primarily on Javascript
- Object Oriented
- String concatination
- static typing
- boolean operators
- logic expressions: switch statements, while loop, for loop, and repeat loop
- imports and exports

### Data Types (JS | Barista):

<table>
  <tr>
    <th>Javascript Type</th>
    <th>Barista Types</th>
  </tr>
  <tr>
    <td>boolean (true/false)</td>
    <td>bool (yes/no)</td>
  </tr>
  <tr>
    <td>string</td>
    <td>name</td>
  </tr>
  <tr>
    <td>Number</td>
    <td>pumps</td>
  </tr>
  <tr>
    <td>object/class</td>
    <td>item</td>
  </tr>
</table>

### Data structures (JS | Barista):

<table>
  <tr>
    <th>Data Structure</th>
    <th>Barista Item</th>
  </tr>
  <tr>
    <td>Array/List</td>
    <td>List</td>
  </tr>
  <tr>
    <td>Dictionary</td>
    <td>menu</td>
  </tr>
</table>

### Other (JS | Barista):

<table>
   <tr>
       <th>function</th>
       <th>order</th>
   </tr>
   <tr>
       <th><</th>
       <th>smaller than</th>
   </tr>
      <tr>
       <th>></th>
       <th>greater than</th>
   </tr>
    </tr>
      <tr>
       <th>===</th>
       <th>equal to</th>
   </tr>
    </tr>
      <tr>
       <th>!==</th>
       <th>not equal to</th>
   </tr>
</table>
## Sample Barista Codes

### Hello World

<table>
<tr> <th>JavaScript</th><th>BaristaCode</th><tr>
</tr>
<td>

```javascript
console.log(“Hello world!”)
```

</td>

<td>

```
print(“Hello world!”);
```

</td>
</table>

### Variable Assignment

<table>
<tr> <th>JavaScript</th><th>BaristaCode</th><tr>
</tr>
<td>

```javascript
var x = 19
```

</td>

<td>

```
var x = 19
pump x = 19
```

</td>
</table>

### Function Declarations

<table>
<tr> <th>JavaScript</th><th>BaristaCode</th><tr>
</tr>
<td>
    
```javascript
function mutiplyByTwo(x){
    return x * 2
}
```
</td>
<td>
    
```
order mutiplyByTwo(pump x) -> pump {
    serve x * 2;
}
```
</td>
</table>

<table>
<tr> <th>JavaScript</th><th>BaristaCode</th><tr>
</tr>
<td>
    
```javascript
function isDivisibleByB(a, b){
    return a % b === 0;
}
```
</td>
<td>
    
```
order isDivisibleByB(pump a, pump b) -> pump { 
   serve a mod b is equal to 0;
}
```
</td>
</table>

### if-statements

<table>
<tr> <th>JavaScript</th><th>BaristaCode</th><tr>
</tr>
<td>
    
```javascript
if (x === 1) {
  return 1;
} else if (x > 1) {
  return 2;
} else if (x < 1>) {
  return 0;
} else {
    return 100
}
```
</td>
<td>
    
```
if (x is equal to 1) {
  serve 1;
} else if (x  is greater than 1) {
  serve 2;
} else if (x is less than 1) {
  serve 0;
} else {
    serve 100;
}
```
</td>
</table>

### Loops

<table>
<tr> <th>JavaScript</th><th>BaristaCode</th><tr>
</tr>
<td>
    
```javascript
while(x !== 2){
    break
}
```
</td>
<td>
    
```
blend while true {
    stop
}
```
</td>
</table>

<table>
<tr> <th>JavaScript</th><th>BaristaCode</th><tr>
</tr>
<td>
    
```javascript
for (var x = 0; x < 5; x++) {
    x++
}
```
</td>
<td>
    
```
repeat until x is equal to 5 {
    add 1 to x
}
```
</td>
</table>

<table>
<tr> <th>Java</th><th>BaristaCode</th><tr>
</tr>
<td>
    
```python
for(int num: nums) {
    System.out.println(num);
}
```
</td>
<td>
    
```
forEach num in nums {
     print(num)
}
```
</td>
</table>

### Classes

<table>
<tr> <th>JavaScript</th><th>BaristaCode</th><tr>
</tr>
<td>
    
```javascript
public class Person {
    public String age;
    public String name;
    public Person(String name, String age) {
        this.age = age;
        this.name = name;
    }

    public void setName(String newName) {
        this.name = newName;
    }

}

Person person = new Person("Jane Doe", 21);
System.out.println(person.name); //Jane Doe
person.setName("John Doe");
System.out.println(person.name); //John Doe

```
</td>
<td>

```

item Person {
pump age;
name personName;

    constructor(pump age, name personName) {
        this.age = age;
        this.personName = personName;
    }

    order setPersonName(name newPersonName) {
        this.personName = newPersonName;
    }

}

Person person = new Person("Jane Doe", 21);
print(person.personName); //Jane Doe
person.setPersonName("John Doe");
print(person.personName); //John Doe

````
</td>
</table>

###  Assignments

<table>
<tr> <th>JavaScript</th><th>BaristaCode</th><tr>
</tr>
<td>

```javascript
let names = ['CJ', 'Berk','Xan']
const numbers = [1,2,3,4]
````

</td>
<td>
    
```
var names = ['CJ', 'Berk','Xan']
constant numbers = [1,2,3,4]
```
</td>
</table>

<table>
<tr> <th>Java</th><th>BaristaCode</th><tr>
</tr>
<td>
    
```Java
int[] array = new int[4];
List<Integer> list = new LinkedList<>();
```
</td>
<td>
    
```
array:[pump] = [];
List list = [];
```
</td>
</table>

### Comments

<table>
<tr> <th>JavaScript</th><th>BaristaCode</th><tr>
</tr>
<td> 
    
```javascript
// comment goes here
```
</td>
<td>
    
```
<comment> comment goes here </commment>
```
</td>
</table>

### Types of Semantic Errors

- Use of non-initialized variables and objects
- Incompatible type comparison
- Incorrect number of function parameters
- Incorrect element types in maps and arrays
- stop outside of loops
- serve outside of a function
- None serve function has a serve value
- Order with serve value doesn't serve anything
- Calling a function or method that is not intialized
- Reassigning a variable with the wrong type
- Incrementing and decrementing with non-pump variable types
- Non-boolean value in conditional
- ForEach loop without an iterable object passed
- For loop with something other than integer value assigned to iterator
- Different types in ternary conditional return
- Declaring a variable with the wrong type
- Declaring an object with the incorrect number of parameters
