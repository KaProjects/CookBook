<%@ page contentType="text/html;charset=UTF-8" pageEncoding="utf-8" trimDirectiveWhitespaces="true" session="false" %>
<%@ taglib tagdir="/WEB-INF/tags" prefix="my" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<my:template>
<jsp:attribute name="menu">

<div class="col col-lg-3">
<div class="list-group">
  <a href="/recipe/list/all" class="list-group-item list-group-item-action list-group-item-warning" role="button">All Recipies</a>

  <button class="list-group-item list-group-item-action dropdown-toggle list-group-item-warning" type="button" data-toggle="collapse" data-target="#categories" aria-expanded="false" aria-controls="categories">
    Categories
  </button>
  <div class="collapse" id="categories">
    <div class="list-group">
      <c:forEach items="${categories}" var="category">
        <a href="/recipe/list/category/${category.id}" class="list-group-item list-group-item-action list-group-item-secondary">${category.name}</a>
      </c:forEach>
    </div>
  </div>
  
  <button class="list-group-item list-group-item-action dropdown-toggle list-group-item-warning" type="button" data-toggle="collapse" data-target="#ingredients" aria-expanded="false" aria-controls="ingredients">
    Ingredients
  </button>
  <div class="collapse" id="ingredients">
    <div class="list-group">
      <c:forEach items="${ingredients}" var="ingredient">
        <a href="/" class="list-group-item list-group-item-action list-group-item-secondary">${ingredient.name}</a>
        <%-- /list/ingr/${ingredient.id} --%>
      </c:forEach>
    </div>
  </div>
</div>
</div>

</jsp:attribute>

<jsp:attribute name="content">

<div class="jumbotron">
    <h1>Welcome to Cook Book Application</h1>
    <p class="lead">This application stores many interesting and tasty recipes. </p>
</div>

</jsp:attribute>
</my:template>