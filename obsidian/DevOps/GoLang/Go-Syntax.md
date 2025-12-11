---
author: Shreya Kothari
---
#devops #golang #gopher 
# GoLang
## 🔎 Resources
 - Official GO Landing page: https://pkg.go.dev/
 - Learn GO: https://go.dev/learn/
 - Markdown Icons: https://gist.github.com/rxaviers/7360908
 - Getting started: ???

## ⚙️ Dev Tools
- Goland, VSCode, Vim etc.
- Gopls (official language server) - Provides IDE-like features for any editor that supports Language Server Protocol (LSP)
  - Code completion, Find references, Formatting, Error diagnostics in real-time, Quick fixes and refactoring, Hover documentation

## 💻 Use Cases (& Frameworks) for GO

### 1. Cloud and network services

- Go Kit (distributed systems incl micro and integrated services)
- [[Gin]] (Web framework)
- Gorilla Toolkit (collection of useful tools without framework lock in)

### 2. Command-line interfaces

- Cobra (CLI application framework)
- Standard Library (Zero dependency API for managing CLI)

### 3. Cloud infrastructure

- Docker (Containerize application to simplify deployment)
- Kubernetes (System that build, deploys, and scales containerized apps)
- Terraform (cloud infrastructue management platform)

## 🏁 Getting Started with Go

### Installation
1. Download Go: https://go.dev/dl/
2. Verify Installation in terminal: ```go version```
   - Add to PATH if needed (usually automatic with installer)
3. Configure Your Editor:
   - Install Go extension, ensure it supports gopls
## 🗂️ Modules and Packages in Go
> [!TIP] 
A **Module** is like a whole project (like a book), 
**packages** are like chapters in that book and
**files** are like pages in each chapter
```
📁 my-project (MODULE)                 
├── go.mod           // Defines this as a module
├── main.go          // In package main
├── 📁 users (PACKAGE)      
│   ├── models.go    // package users
│   └── handlers.go  // package users
└── 📁 orders (PACKAGE)
    └── orders.go    // package orders
```
### Project Structure Overview
```
my_project/
├── go.mod           // module definition and dependencies
├── go.sum           // lock file; created automatically
├── main.go          // entry point; package main
├── server.go        // can also be package main
├── utils/           // package utils
│   └── helper.go
├── database/        // package database
│   └── db.go
└── handlers/        // package handlers
    └── auth.go
```

### What are Packages in GO

#### Basic Concepts
- A package is a collection of related `.go` files in the same directory
- Way to organize and reuse code
- Every `.go` file must start with `package` declaration
- All files in same directory must share same package name
- Package name typically matches directory name (except `main`)

#### Types of Packages
1. `package main`:
   - Special package that creates executable programs
   - Must contain `main()` function (program's entry point)
   - Multiple files can be `package main`
   - Only one `main()` function allowed per program
   - `go run .` looks for `main()` in `package main`

2. Library Packages:
   - Reusable code (like `utils`, `handlers`)
   - Named after their purpose (`package database`, `package auth`)
   - Can be imported by other packages

#### Package Visibility
- Capitalized names are public (exported):
  ```go
  func PrintLog() {}      // accessible from other packages
  type User struct {}     // accessible from other packages
  ```
- Lowercase names are private (unexported):
  ```go
  func validateInput() {} // only accessible within same package
  type config struct {}  // only accessible within same package
  ```

#### Project Structure Example
```
my-app/
├── main.go          // package main
├── server.go        // package main (same directory)
├── auth/
│   └── login.go     // package auth
└── utils/
    └── helper.go    // package utils
```


### Understanding Modules
- Module is your whole project; contains one or more related Go packages
- Defined by `go.mod` file at root directory
- Manages dependencies and versions
- Created using: `go mod init module-path`
  ```bash
  go mod init github.com/username/project
  # or for local development
  go mod init myproject
  ```

### Module Management
#### go.mod File
- Every Go project needs a `go.mod` file - it's like a project manifest
- It tracks your project's name, Go version, and dependencies
- Without it, you can't use external packages or create multi-file projects
- Created using `go mod init project_name`
  
```go
module github.com/username/project
go 1.21
require (
    github.com/gorilla/mux v1.8.1
)
```

#### go.sum File
- Automatically created
- Contains dependency checksums
- Ensures dependency integrity
- Should be committed to version control

#### Common Module Commands
```bash
go mod init [name]   # create new module
go mod tidy          # add/removes dependencies- auto updates go.mod
go get [package]     # add new dependency in go.mod
```

## Writing Your First Go Program

### Creating Project Structure
```bash
mkdir hello-project
cd hello-project
go mod init hello-project
```

### Writing Basic Program
Create `main.go`:
```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
```

### Running the Program
```bash
go run main.go    # or
go run .          # runs package main
```

### Building Executable
```bash
go build          # creates executable
```

## :notebook: Data types in GO


| Type | Description |
| --- | --- |
| `Strings` | <ul><li> "This is a string" (interpreted String)</li><li>\`This is also a string\` (raw string - to be used with unstructured text)</li></ul> |
| `Boolean` |[True, False] |
| `Numbers` | <ul><li> Integers (99 , 0 , -99)</li><li>Unsigned Integers (0, 15, 234)</li><li>Floating point numbers (float32, float64)</li><li>Complex numbers (complex64, complex128)</li></ul> |
| `Error` |<ul><li>  nil = no error</li><li>No exception mechanism, we simply return errors when things go wrong</li><li>we can call an error method, which which will return error message to us</li></ul>|

## Variable declaration

### Using 'VAR' keyword

``` go 
var myName string
myName = "Shreya"
// declare only
```
or
``` go 
var myName string = "Shreya" 
// declare + initialise
```
or

``` go 
var myName = "Shreya" 
// declare + inferred initialise
```
### Short Declaration syntax (Commonly used)
``` go 
myName := "Shreya" 
```

### Multiple Assignments

``` go
name, score := "Shreya Kothari", 87
```
## Constants

Data type of const varies based on what the compiler needs it to be for interpretation (integer, unsigned int, float etc)
``` go 
const a = 42
```

To restrict the usage of const to certain type:
``` go 
const b string = "Hello, Gophers!"
```
We can declare dynamic values to constants (like 2*5)
> [!CAUTION] RESTRICTION: no functions! 
> it should be able to evaluate at compile time. 
### Multiple constant declaration

``` go 
const (
    a = 42
    b = "Hello, Gophers!"
    c = a
    d = 2*5 //10
)
```

## Pointers & Values
Normally, when we assign one variable to another, it takes the **value** of that variable currently, in a separate memory location:

``` go 
a := 3
b := a // a currently 3, so b = 3
a := 4

// a = 4, and b continues to be 3
```
However, we can use ``` &``` to assign the address (memory location) of the variable instead. That means, when one variable updates, all other variables **pointing** to that address also update:
``` go
a := 3
b := &a //b holds memory address of a

*b //3 

a := 27

*b //27
```

- Pointers share memory, values are independent copies
- Use values to copy data, and use pointers to share data
  > [!CAUTION] Pointers may lead to concurrency problems later on
  
  > [!TIP] Use copies (values) wherever possible

### Dereferencing Pointers

```go
a := "foo"
b := &a
*b      // b = foo

*b = "bar" // dereference using *
```

### Empty Pointers
Create pointer to anonymous variable using built-in "new" function
```go
c = new(int)
```

## Aggregating Data Types
### Arrays

- List with index starting at 0
- Same fixed data type
- Arrays preserve order of items
- Arrays = static length in GO

```go
var arr [3]int
// array of 3 ints

fmt.Println(arr)
// [0 0 0]

arr = [3]int{1, 2, 3}
// arr = [1, 2, 3]

fmt.Println(arr[1])
// 2

arr[1] = 99 
// Update value

fmt.Println(arr)
// [1, 99, 3]

```
### Slices
- Subset of Array (Creating a slice from array)
- Fixed Datatype
- Slices don't contain their own data, they reference data from an Array
- Preserve order of items
- **Slices are not Comprable**: We cannot check if 2 slices are the same using ```==```. 
  - For comparision, look into standard library for functions to allow comparision
   
```go
var s[]int
// no size, as size comes from somewhere else

fmt.Println(s)
// [] (nil)

s = []int{1,2,3}
// added elems 1,2,3 just like an array

fmt.Println(s[1])
// 2

s[1] = 99
// updated: [1, 99, 3]

s = append(s, 5, 10, 15)
// we are able to add vals: [1, 99, 3, 5, 10, 15]
// this is returning a 'new' slice stored in 's'

s = slices.Delete(s, 1, 3)
// removes indices upto (but not incl) 3 - removes index 1 and 2 from slice
```

#### Copying slices

> [!IMPORTANT] Slices are copied by reference by default
Updating value in one will update values in another

```go
s = []string{"foo", "bar", "baz"}
s2 := s
s[0], s2[2] = "qux", "fred"

// s,s2 = ["qux", "bar", "fred"]
```
> [!TIP] To copy slices by value, use:
> ```slices.Clone ```

### Maps
- Like python dictionaries (Key, Value)
- do **NOT** preserve ordering of keys
- Data type of keys and values are predefined and **CANNOT** change
- Maps are copied by reference ```m2 := m```
  - To copy by value, use ```maps.Clone``` from standard library
- Maps are NOT comparable 
   >[!CAUTION]
    ```m2==m``` will lead to an error 
```go
var m map[string]int
// key = str, val = int

m = map[string]int{"foo": 1, "bar": 2}

fmt.println(m["foo"])
// lookup value in map
// 1

delete(m,"foo")
// takes in key whose entry we need to remove

m["baz"] = 418
// adding a new entry

fmt.Println(m["Non-existing key"])
// 0
```

> [!IMPORTANT] 
> If we query a key that doesn't exist, it will return 0. Go always return an int value regardless of its existence.
> However, that may cause confusion as to where did the value come from? Map or non-existence..

To solve that:

``` go
v, ok := m["Non-existing key"]
// comma ok syntax verifies presence
// v = 0, ok = FALSE
```
- 'ok' is a boolean value which will be TRUE if value came from Map and FALSE if it did not


### Struct
- A struct is a collection of fields with different data types
- Think of it as a custom data type that groups related data together
- Similar to classes in other languages (but without methods)
- Structs **ARE** comparable
- Fixed sized collection, but NO predifined datatype
  - Similar to array, but can hold varied dtypes - int, string, slice, struct **all in one struct**
  - >[!IMPORTANT] only limitation we have is we CANNOT dynamically add fields, we need to predefine what types, and where are we adding

#### Basic Struct Usage
```go
// Define a basic struct directly
var person struct {
    name string
    age  int
}

// Use it
person.name = "Arthur"
person.age = 30
```

#### Creating Custom Struct Types
- Instead of defining structs inline, we usually create reusable struct types (using keyword `type`, instead of `var`)
  -  Idea is to ceate a struct data**type**. Then we can define **variables** of that type (multiple instances of that type)
- Makes code cleaner and reusable
```go
// Define a custom struct datatype
type Person struct {
    name    string
    age     int
    address string
    salary  float64
}

// Create instances
var employee1 Person
employee1.name = "Arthur"

// Or use struct literal
employee2 := Person{
    name: "Alice",
    age:  25,
}
```

#### Important Characteristics
- Structs are value types (copied when assigned or passed to functions)
```go
p1 := Person{name: "Arthur"}
p2 := p1          // Creates a complete copy
p2.name = "Alice" // Doesn't affect p1
```

- Fields must be predefined (can't add new fields at runtime)
- Can contain any type of data:
```go
type Company struct {
    name      string
    employees []Person    // Slice of Person structs
    location  Address     // Another struct
    active    bool
    revenue   float64
}
```

### Comparing Structs
- Structs are comparable if all their fields are comparable
```go
p1 := Person{name: "Arthur", age: 30}
p2 := Person{name: "Arthur", age: 30}
fmt.Println(p1 == p2) // true
```

### Memory Layout
```go
type Employee struct {
    name   string    // Field 1
    id     int       // Field 2
    active bool      // Field 3
}
```
- Fields are stored sequentially in memory
- Each field can be accessed directly using the dot notation

## Control Flow: Branches

### IF Statements
- Of the form:
  
```
if test {...}
else if test {...}
else {...}
```
- This test will evaluate to either true or false
  - If true: statement in bracket will execute
  - If False: program will ignore if block and continue in flow

### SWITCH Statements
Designed to provide efficient implementation of tests

```
switch test expression{
  case expression1:
    statements
  case expression2, expression3: //if exp2 OR exp3 match with exp, statement will be evaluated
    statements
  default:
    fmt.Println("default case")
}
```
```go

switch i:=5, i { // var initliasing and testing in one line; testing for variable 'i'
  case 1: // if i = 1, do the below
    fmt.Println("First Case")
  case 2+3, 2*i+3:
    fmt.Println("Second Case")
  default: // if no cases work
    fmt.Println("default case")
}

```

### Loops


#### 1. Inifinite Loops
Print and update variable cycle: ```for {...} // infinite```
```go

i := 1
for {
  fmt.Println(i)
  i+=1
}
fmt.Println("Done!") // never reaches here
```
#### 2. Loop-till condition 
Print and update variable UNTIL i reaches 3: ```for condition {}```
```go
i := 1
for i < 3{
  fmt.Println(i)
  i+=1
}
fmt.Println("Done!") // reaches after 2 iterations
```
#### 3. Counter-based Loops
Code goes to 'initializer' condition first (& only once); then evaluates the 'test' > if test = True, execute loop; and go to 'post caluse' after every loop iteration; then again revisit test clause..
```for initializer; test; post clause {...}```
```go

for i := 1; i < 3; i++ {
  fmt.Println(i)
}
fmt.Println("Done!") 
```
