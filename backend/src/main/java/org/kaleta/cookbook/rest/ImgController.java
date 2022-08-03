package org.kaleta.cookbook.rest;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.kaleta.cookbook.entity.Image;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.Base64;

@RestController
@RequestMapping(value = "/img")
@Deprecated
public class ImgController {
    private static SessionFactory factory;

    private SessionFactory getFactory(){
        if (factory == null) {
            Configuration configuration = new Configuration();
            configuration.addAnnotatedClass(Image.class);
            factory = configuration.buildSessionFactory();
        }
        return factory;
    }

    @RequestMapping(value = "/add",
            method = { RequestMethod.POST},
            consumes = { "multipart/form-data" })
    public int insertImage(@RequestParam("img") MultipartFile file) throws IOException {
        int generatedId = -1;
        try (Session session = getFactory().openSession()) {
            Image image = new Image();
            byte[] bytes = Base64.getEncoder().encode(file.getBytes());
            image.setImg(bytes);

            Transaction tx = null;
            try {
                tx = session.beginTransaction();
                session.save(image);
                generatedId = image.getId();
                tx.commit();
            } catch (HibernateException e) {
                if (tx != null) tx.rollback();
                e.printStackTrace();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return generatedId;
    }

    @RequestMapping("/get")
    @Transactional
    public @ResponseBody byte[] getImage(@RequestParam(value = "id") String id) {
        Image image = null;
        try (Session session = getFactory().openSession()) {
            Transaction tx = null;
            try {
                tx = session.beginTransaction();

                image = session.get(Image.class, Integer.valueOf(id));

                tx.commit();
            } catch (HibernateException e) {
                if (tx != null) tx.rollback();
                e.printStackTrace();
            }
        }
//        return Base64.getDecoder().decode(image.getImg());
        return image.getImg();
    }
}
