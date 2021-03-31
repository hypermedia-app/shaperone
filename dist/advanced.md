# Advanced shapes

SHACL is a fantastic tool which can be used for a multitude of [use cases serving different purposes][ucr]. Shaperone tries to stay true to the specification but given its flexibility, arbitrary design choices are made for certain SHACL features to interpret them in a way most useful for the purpose of building forms.

This page describes how various SHACL constructs are handled and, where applicable, how Shaperone deviates or extends the standard.

[ucr]: https://www.w3.org/TR/shacl-ucr/  

## [Logical Constraint Components](https://www.w3.org/TR/shacl/#core-components-logical)

The predicates `sh:or`, `sh:or`, `sh:and` and `sh:xone` represents logical operators which specify additional conditions which apply to sets of shapes and properties.

> [!TIP]
> `sh:not` constraint has no effect on the form. It is ignored and no field will be rendered for its properties.

### Used with Node Shape

The Shape processor will combine all properties found in the SHACL lists of logical constraints with those attached directly to the current shape.

For example, with a shape defined as seen below, Shaperone will display three input fields.  

```turtle
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix schema: <http://schema.org/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix ex: <http://example.com/> .

ex:PersonShape
  sh:property [ sh:path schema:familyName ] ;
  sh:or (
    [ sh:property [ sh:path schema:firstName ] ]
    [ sh:property [ sh:path schema:givenName ] ]
  )
.
```

> [!TIP]
> The members of a logical constraint list can also be PropertyShapes without the need for an additional level of `sh:property`
> ```turtle
> ex:PersonShape
    sh:property [ sh:path schema:familyName ] ;
    sh:or (
      [ sh:path schema:firstName ]
      [ sh:path schema:givenName ]
    )
  .

> [!EXAMPLE]
> Click [here][node-logical] for a complete example using the above shape

[node-logical]: ${playground}/?shapes=%40prefix+sh%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fshacl%23%3E+.%0A%40prefix+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E+.%0A%40prefix+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E+.%0A%40prefix+ex%3A+%3Chttp%3A%2F%2Fexample.com%2F%3E+.%0A%0Aex%3APersonShape%0A++a+sh%3AShape+%3B%0A++sh%3AtargetClass+schema%3APerson+%3B%0A++rdfs%3Alabel+%22Person%22+%3B%0A++sh%3Aproperty+ex%3ALastNameProperty+%3B%0A++sh%3Aor+%28+%0A++++ex%3AFirstNameProperty+%0A++++ex%3AGivenNameProperty%0A++%29%0A.%0A%0Aex%3ALastNameProperty+%0A++a+sh%3APropertyShape+%3B%0A++sh%3Apath+schema%3AfamilyName+%3B%0A++sh%3Aorder+20+%3B%0A++sh%3AmaxCount+1+%3B%0A.%0A%0Aex%3AFirstNameProperty%0A++sh%3Apath+schema%3AfirstName+%3B++++%0A++sh%3Aorder+10+%3B%0A++sh%3AmaxCount+1+%3B%0A.%0A%0Aex%3AGivenNameProperty%0A++sh%3Apath+schema%3AgivenName+%3B%0A++sh%3Aorder+10+%3B%0A++sh%3AmaxCount+1+%3B%0A.&resource=%7B%0A++%22%40context%22%3A+%7B%0A++++%22rdf%22%3A+%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%2C%0A++++%22rdfs%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%22%2C%0A++++%22xsd%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%22%2C%0A++++%22schema%22%3A+%22http%3A%2F%2Fschema.org%2F%22%0A++%7D%2C%0A++%22%40id%22%3A+%22http%3A%2F%2Fexample.com%2FJohn_Doe%22%2C%0A++%22%40type%22%3A+%22schema%3APerson%22%2C%0A++%22schema%3AfamilyName%22%3A+%22Doe%22%2C%0A++%22schema%3AfirstName%22%3A+%22John%22%0A%7D&selectedResource=http%3A%2F%2Fexample.com%2FJohn_Doe
