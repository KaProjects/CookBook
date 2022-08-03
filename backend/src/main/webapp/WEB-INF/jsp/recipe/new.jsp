<%@ page contentType="text/html;charset=UTF-8" pageEncoding="utf-8" trimDirectiveWhitespaces="true" session="false" %>
<%@ taglib tagdir="/WEB-INF/tags" prefix="my" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<my:template>
<jsp:attribute name="content">

<script>
var addRecipeBtn = document.getElementById("addRecipe");
addRecipeBtn.setAttribute("class", "btn btn-success disabled")
</script>

<form:form method="post" action="/recipe/create" modelAttribute="recipeCreate" class="ml-5 mr-5">

  <%-- NAME --%>
  <div class="form-group mt-5">
    <form:label path="name" class="col-sm-2 control-label">Name</form:label>
    <div class="col-sm-10">
      <form:input path="name" class="form-control shadow-sm"/>
    </div>
  </div>

  <%-- CATEGORY --%>
  <div class="form-group">
    <form:label path="categoryId" class="col-sm-2 control-label">Category</form:label>
    <div class="col-sm-10">
      <form:select path="categoryId" class="form-control shadow-sm">
        <form:option  value="">-- select category --</form:option>
        <c:forEach items="${categories}" var="category">
          <form:option value="${category.id}">${category.name}</form:option>
        </c:forEach>
      </form:select>
    </div>
  </div>

  <%-- IMAGE --%>
  <div class="form-group">
    <form:label path="image" class="col-sm-2 control-label">Image</form:label>
    <div class="col-sm-10">
      <form:input type="file" path="image" class="form-control-file shadow-sm"/>
    </div>
  </div>

  <%-- INGREDIENTS --%>
  <div class="form-group" id="ingredientList">
    <form:label path="ingredients" class="col-sm-2 control-label">Ingredients</form:label>
    <c:forEach items="${recipeCreate.ingredients}" var="ingredient" varStatus="vs">
    <div class="form-row col-sm-10 mb-2">
      <div class="input-group shadow-sm">
        <div class="input-group-prepend">
          <form:select path="ingredients[${vs.index}].ingredientId" class="form-control">
            <form:option  value="">-- select ingredient --</form:option>
            <c:forEach items="${ingredients}" var="ingredientType">
              <form:option value="${ingredientType.id}">${ingredientType.name}</form:option>
            </c:forEach>
          </form:select>
        </div>

        <form:input path="ingredients[${vs.index}].quantity" class="form-control shadow-sm"/>

        <form:input path="ingredients[${vs.index}].unit" class="form-control shadow-sm"/>

        <div class="input-group-prepend">
          <div class="input-group-text">
            <form:checkbox path="ingredients[${vs.index}].mandatory" data-toggle="tooltip" data-placement="bottom" title="Mandatory Ingredient"/>
          </div>
        </div>
        

      </div>
    </div>
    </c:forEach>
  </div>

  <button class="btn btn-primary shadow-sm" type="button" 
  onclick="addIngredient(${recipeCreate.ingredients.size()});">Add Ingredient</button>
  
  <%-- STEPS --%>
  <div class="form-group" id="stepList">
    <form:label path="steps" class="col-sm-2 control-label">Steps</form:label>
    <c:forEach items="${recipeCreate.steps}" var="step" varStatus="vs">
    <div class="form-row col-sm-10 mb-2">
      <form:hidden path="steps[${vs.index}].number" value="${step.number}"/>
      <div class="input-group shadow-sm">
        <div class="input-group-prepend">
          <form:label path="steps[${vs.index}]" class="input-group-text">${step.number}.</form:label>
        </div>
        <form:textarea path="steps[${vs.index}].text" type="text" class="form-control" rows="1"/>
        <div class="input-group-prepend">
          <div class="input-group-text">
            <form:checkbox path="steps[${vs.index}].mandatory" data-toggle="tooltip" data-placement="bottom" title="Mandatory Step"/>
          </div>
        </div>
      </div>
    </div> 
    </c:forEach>
  </div>

  <button class="btn btn-primary shadow-sm" type="button" onclick="addStep(${recipeCreate.steps.size()});">Add Step</button>  
  
  <%-- TODO add space --%>
  <hr />

  <button class="btn btn-primary btn-lg shadow-lg float-right" type="submit">Create Recipe</button>

</form:form>

<%-- add new step and ingredient to the form --%>
<script>

var ingredientIndex;

function addIngredient(newIndex){
if (ingredientIndex == null) {
  ingredientIndex = newIndex;
}

var ingredientList = document.getElementById("ingredientList");
var row = document.createElement("div");
row.setAttribute("class", "form-row col-sm-10 mb-2");

var inputGroup = document.createElement("div");
inputGroup.setAttribute("class", "input-group shadow-sm"); 

var inputGroupPre = document.createElement("div");
inputGroupPre.setAttribute("class", "input-group-prepend"); 
var inputGroupSelect = document.createElement("select");
inputGroupSelect.setAttribute("id", "ingredients" + ingredientIndex + ".ingredientId"); 
inputGroupSelect.setAttribute("name", "ingredients[" + ingredientIndex + "].ingredientId"); 
inputGroupSelect.setAttribute("class", "form-control"); 

var inputGroupSelectOption = document.createElement("option");
inputGroupSelectOption.setAttribute("value", null); 
inputGroupSelectOption.appendChild(document.createTextNode("-- select ingredient --"));
inputGroupSelect.appendChild(inputGroupSelectOption);

var ingrArray = [];
<c:forEach items="${ingredients}" var="ingr">
  var arr = [];

  arr.push("<c:out value="${ingr.id}" />");
  arr.push("<c:out value="${ingr.name}" />");

  ingrArray.push(arr);
</c:forEach>

console.log(ingrArray);

ingrArray.forEach(element => {
  var ingrOption = document.createElement("option"); 
  ingrOption.setAttribute("value", element[0]);
  ingrOption.appendChild(document.createTextNode(element[1]));
  inputGroupSelect.appendChild(ingrOption);
});

inputGroupPre.appendChild(inputGroupSelect);
inputGroup.appendChild(inputGroupPre);

var inputQuantity = document.createElement("input");
inputQuantity.setAttribute("id", "ingredients" + ingredientIndex + ".quantity"); 
inputQuantity.setAttribute("name", "ingredients[" + ingredientIndex + "].quantity"); 
inputQuantity.setAttribute("class", "form-control shadow-sm"); 
inputQuantity.setAttribute("type", "text");
inputGroup.appendChild(inputQuantity);

var inputUnit = document.createElement("input");
inputUnit.setAttribute("id", "ingredients" + ingredientIndex + ".unit"); 
inputUnit.setAttribute("name", "ingredients[" + ingredientIndex + "].unit"); 
inputUnit.setAttribute("class", "form-control shadow-sm"); 
inputUnit.setAttribute("type", "text");
inputGroup.appendChild(inputUnit);

var inputGroupPost = document.createElement("div");
inputGroupPost.setAttribute("class", "input-group-prepend"); 
var inputGroupPostDiv = document.createElement("div");
inputGroupPostDiv.setAttribute("class", "input-group-text"); 

var checkbox = document.createElement("input");
checkbox.setAttribute("id", "ingredients" + ingredientIndex + ".mandatory1"); 
checkbox.setAttribute("name", "ingredients[" + ingredientIndex + "].mandatory");  
checkbox.setAttribute("title", "Mandatory Ingredient"); 
checkbox.setAttribute("data-toggle", "tooltip");
checkbox.setAttribute("data-placement", "bottom");
checkbox.setAttribute("type", "checkbox"); 
checkbox.setAttribute("value", "true"); 
checkbox.setAttribute("checked", "checked"); 
inputGroupPostDiv.appendChild(checkbox);

var checkboxHidden = document.createElement("input");
checkboxHidden.setAttribute("type", "hidden"); 
checkboxHidden.setAttribute("name", "_ingredients[" + ingredientIndex + "].mandatory"); 
checkboxHidden.setAttribute("value", "on"); 
inputGroupPostDiv.appendChild(checkboxHidden);

inputGroupPost.appendChild(inputGroupPostDiv);
inputGroup.appendChild(inputGroupPost);

row.appendChild(inputGroup);

ingredientList.appendChild(row);

ingredientIndex++;
}

var stepIndex;

function addStep(newIndex){
if (stepIndex == null) {
  stepIndex = newIndex;
}

var stepList = document.getElementById("stepList");
var row = document.createElement("div");
row.setAttribute("class", "form-row col-sm-10 mb-2");

var hidden = document.createElement("input");
hidden.setAttribute("id", "steps" + stepIndex + ".number");  
hidden.setAttribute("name", "steps[" + stepIndex + "].number");  
hidden.setAttribute("value", stepIndex + 1); 
hidden.setAttribute("type", "hidden"); 
row.appendChild(hidden);

var inputGroup = document.createElement("div");
inputGroup.setAttribute("class", "input-group shadow-sm"); 

var inputGroupPre = document.createElement("div");
inputGroupPre.setAttribute("class", "input-group-prepend"); 
var inputGroupLabel = document.createElement("label");
inputGroupLabel.setAttribute("for", "steps0"); 
inputGroupLabel.setAttribute("class", "input-group-text"); 
inputGroupLabel.appendChild(document.createTextNode((stepIndex + 1) + "."));
inputGroupPre.appendChild(inputGroupLabel);
inputGroup.appendChild(inputGroupPre);


var inputGroupTextArea = document.createElement("textarea");
inputGroupTextArea.setAttribute("id", "steps" + stepIndex + ".text");  
inputGroupTextArea.setAttribute("name", "steps[" + stepIndex + "].text");  
inputGroupTextArea.setAttribute("type", "text");
inputGroupTextArea.setAttribute("class", "form-control"); 
inputGroupTextArea.setAttribute("rows", "1"); 
inputGroup.appendChild(inputGroupTextArea);

var inputGroupPost = document.createElement("div");
inputGroupPost.setAttribute("class", "input-group-prepend"); 
var inputGroupPostDiv = document.createElement("div");
inputGroupPostDiv.setAttribute("class", "input-group-text"); 

var checkbox = document.createElement("input");
checkbox.setAttribute("id", "steps" + stepIndex + ".mandatory1"); 
checkbox.setAttribute("name", "steps[" + stepIndex + "].mandatory");  
checkbox.setAttribute("title", "Mandatory Step"); 
checkbox.setAttribute("data-toggle", "tooltip");
checkbox.setAttribute("data-placement", "bottom");
checkbox.setAttribute("type", "checkbox"); 
checkbox.setAttribute("value", "true"); 
checkbox.setAttribute("checked", "checked"); 
inputGroupPostDiv.appendChild(checkbox);

var checkboxHidden = document.createElement("input");
checkboxHidden.setAttribute("type", "hidden"); 
checkboxHidden.setAttribute("name", "_steps[" + stepIndex + "].mandatory"); 
checkboxHidden.setAttribute("value", "on"); 
inputGroupPostDiv.appendChild(checkboxHidden);

inputGroupPost.appendChild(inputGroupPostDiv);
inputGroup.appendChild(inputGroupPost);

row.appendChild(inputGroup);

stepList.appendChild(row);

stepIndex++;
}
</script>

</jsp:attribute>
</my:template>