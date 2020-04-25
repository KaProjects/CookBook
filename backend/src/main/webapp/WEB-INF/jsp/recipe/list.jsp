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
  <a href="/recipe/list/all" class="list-group-item list-group-item-action list-group-item-warning ${allActive}" role="button">All Recipies</a>

  <button class="list-group-item list-group-item-action dropdown-toggle list-group-item-warning" type="button" data-toggle="collapse" data-target="#categories" aria-expanded="false" aria-controls="categories">
    Categories
  </button>
  <div class="collapse ${catShow}" id="categories">
    <div class="list-group">
      <c:forEach items="${categories}" var="category">
        <c:choose>
          <c:when test="${category.id == catActive}">
            <a href="/recipe/list/category/${category.id}" class="list-group-item list-group-item-action list-group-item-secondary active">${category.name}</a>
          </c:when>
          <c:otherwise>
            <a href="/recipe/list/category/${category.id}" class="list-group-item list-group-item-action list-group-item-secondary">${category.name}</a>
          </c:otherwise>
      </c:choose>
      </c:forEach>
    </div>
  </div>
  
  <button class="list-group-item list-group-item-action dropdown-toggle list-group-item-warning" type="button" data-toggle="collapse" data-target="#ingredients" aria-expanded="false" aria-controls="ingredients">
    Ingredients
  </button>
  <div class="collapse ${ingShow}" id="ingredients">
    <div class="list-group">
      <c:forEach items="${ingredients}" var="ingredient">
      <c:choose>
          <c:when test="${ingredient.id == ingActive}">
            <a href="/recipe/list/ingredient/${ingredient.id}" class="list-group-item list-group-item-action list-group-item-secondary active">${ingredient.name}</a>
          </c:when>
          <c:otherwise>
            <a href="/recipe/list/ingredient/${ingredient.id}" class="list-group-item list-group-item-action list-group-item-secondary">${ingredient.name}</a>
          </c:otherwise>
      </c:choose>
      </c:forEach>
    </div>
  </div>
</div>
</div>

</jsp:attribute>

<jsp:attribute name="content">

<ul class="list-group">
      <c:forEach items="${recipes}" var="recipe">
        <li class="list-group-item">${recipe.name}</li>
      </c:forEach>
</ul>

</jsp:attribute>
</my:template>