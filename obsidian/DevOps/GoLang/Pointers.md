---
author: Shreya Kothari
---

# Understanding Go Functions and Pointers

## Functions in [[Go-Syntax|Go]]

Go has two ways to define functions, and it uses pointers to efficiently work with data.

### 1. Regular Functions

These are standalone functions that can receive input and return output.

```go
func calculateSum(a int, b int) int {
    return a + b
}
```

**How to use it:**

```go
total := calculateSum(5, 3)  // total = 8
```

### 2. Methods (Functions Attached to Types)

Methods belong to a specific type. They can access and modify the properties of that type.

```go
type Rectangle struct {
    Width  float64
    Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}
```

**How to use it:**

```go
myRect := Rectangle{Width: 5, Height: 3}
area := myRect.Area()  // area = 15
```

## Understanding Pointers

### What is a Pointer?

A pointer is a variable that stores the memory address of another variable.

Think of your house address. It's not the house itself; it's the information needed to find the house.

### Pointer Syntax

- `&variable` - Gets the memory address of a variable
- `*Type` - Declares a pointer to a Type
- `*pointer` - Accesses the value at the address stored in the pointer

### Why Use Pointers?

1. **To modify values**: When you pass a large struct to a function, Go makes a copy. With pointers, you work with the original data.
2. **Efficiency**: Copying large data structures is expensive.

## Examples with Pointers

### Regular Function with Value Parameter

```go
func doubleAge(age int) int {
    return age * 2
}

personAge := 25
doubledAge := doubleAge(personAge)  // personAge is still 25, doubledAge is 50
```

### Regular Function with Pointer Parameter

```go
func celebrateBirthday(age *int) {
    *age = *age + 1  // Increases the original value
}

personAge := 25
celebrateBirthday(&personAge)  // personAge is now 26
```

### Method with Value Receiver

```go
type Person struct {
    Name string
    Age  int
}

func (p Person) GetDescription() string {
    return fmt.Sprintf("%s is %d years old", p.Name, p.Age)
}

person := Person{Name: "Alice", Age: 30}
desc := person.GetDescription()  // "Alice is 30 years old"
```

### Method with Pointer Receiver

```go
func (p *Person) GrowOlder() {
    p.Age = p.Age + 1  // Modifies the original Person
}

person := Person{Name: "Bob", Age: 25}
person.GrowOlder()  // person.Age is now 26
```

## Putting It All Together

Let's see how methods and pointers combine in a practical example:

```go
type Counter struct {
    Value int
}

// Method with value receiver - cannot modify the original Counter
func (c Counter) GetValue() int {
    return c.Value
}

// Method with pointer receiver - can modify the original Counter
func (c *Counter) Increment() {
    c.Value = c.Value + 1
}

// Create a counter
myCounter := Counter{Value: 0}

// Get the current value (using value receiver method)
fmt.Println(myCounter.GetValue())  // 0

// Increment the counter (using pointer receiver method)
myCounter.Increment()
fmt.Println(myCounter.GetValue())  // 1
```

In this example, Go automatically handles the conversion between values and pointers when you call methods, making the syntax cleaner.