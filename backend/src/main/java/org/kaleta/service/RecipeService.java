package org.kaleta.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.NoResultException;
import org.kaleta.dao.RecipeDao;
import org.kaleta.entity.Recipe;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;
import java.util.Iterator;
import java.util.List;

@ApplicationScoped
public class RecipeService {

    @Inject
    RecipeDao recipeDao;

    public Recipe getRecipe(String id) {
        try {
            return recipeDao.get(id);
        } catch (NoResultException e) {
            return null;
        }
    }

    public List<Recipe> getRecipes() {
        return recipeDao.getList();
    }

    public String createRecipe(Recipe recipe) {
        recipe.setImage(compress(recipe.getImage()));
        return recipeDao.create(recipe);
    }

    public void updateRecipe(Recipe recipe) {
        recipe.setImage(compress(recipe.getImage()));
        recipeDao.update(recipe);
    }

    private String compress(String image) {
        if (image == null) return null;
        String imageData = image.split(",")[1];
        String imagePrefix = image.split(",")[0];

        try(InputStream inputStream = new ByteArrayInputStream(Base64.getDecoder().decode(imageData));
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            ImageOutputStream imageOutputStream = ImageIO.createImageOutputStream(byteArrayOutputStream)){

            Iterator<ImageWriter> imageWriterIterator = ImageIO.getImageWritersByFormatName("jpeg");
            ImageWriter imageWriter = imageWriterIterator.next();
            imageWriter.setOutput(imageOutputStream);

            ImageWriteParam params = imageWriter.getDefaultWriteParam();
            if(params.canWriteCompressed()){
                params.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                params.setCompressionQuality(0.5f);
            }

            imageWriter.write(null, new IIOImage(ImageIO.read(inputStream), null, null), params);

            return imagePrefix + "," + Base64.getEncoder().encodeToString(byteArrayOutputStream.toByteArray());
        } catch(IOException e){
            throw new IllegalStateException(e);
        }
    }
}
