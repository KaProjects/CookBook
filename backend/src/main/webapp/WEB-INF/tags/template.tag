<!DOCTYPE html>
<%@ tag pageEncoding="utf-8" dynamic-attributes="dynattrs" trimDirectiveWhitespaces="true" %>
<%@ attribute name="head" fragment="true" %>
<%@ attribute name="menu" fragment="true" %>
<%@ attribute name="content" fragment="true" required="true" %>
<%@ taglib tagdir="/WEB-INF/tags" prefix="my" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="f" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html lang="${pageContext.request.locale}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cook Book</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

    <jsp:invoke fragment="head"/>
</head>
<body>


<div class="container-fluid">
    <div class="row">
        <nav class="col navbar navbar-dark" style="background-color: #FD6A56;" >
            <a class="navbar-brand text-dark" href="/" style="font-weight: bold;">
                <img src="${pageContext.request.contextPath}/chef.svg" alt=" " width="30" height="30" class="d-inline-block align-top" alt=""> 
                Cook Book
            </a>
            <a id="addRecipe" href="/recipe/new" class="btn btn-success" role="button">Add Recipe</a>
        </nav>
    </div>
    <div class="row">
        
        <jsp:invoke fragment="menu"/>
        
        <div class="col">
            <jsp:invoke fragment="content"/>
        </div>
    </div>
    <div class="row">
        <footer class="col footer text-dark" style="position: fixed; left: 0; bottom: 0; width: 100%; background-color: #FD6A56; color: white; text-align: center;">
            <p>&copy;&nbsp;<%=java.time.Year.now().toString()%>&nbsp;Stanislav Kaleta</p>
        </footer>
    </div>
</div>



<!-- javascripts placed at the end of the document so the pages load faster -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
</body>
</html>