package org.kaleta.cookbook.rest;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.kaleta.cookbook.entity.Data;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

//@RestControllertroller
@Deprecated
public class DataController {
    private static SessionFactory factory = config().buildSessionFactory();

    private static Configuration config() {
        Configuration configuration = new Configuration();
        configuration.addAnnotatedClass(Data.class);
        return configuration;
    }

    public static void testHibernate() {

        try (Session session = factory.openSession()) {
            Transaction tx = null;
            Integer generatedId = null;

            for (int i = 0; i < 10; i++) {
                try {
                    tx = session.beginTransaction();

                    Data data = new Data();
                    data.setKey("key" + i);
                    data.setValue("value" + i);

                    generatedId = (Integer) session.save(data);
                    tx.commit();
                } catch (HibernateException e) {
                    if (tx != null) tx.rollback();
                    e.printStackTrace();
                }
                System.out.println("ID " + generatedId);
            }

        }
    }

    @RequestMapping("/data/get")
    public Data getData(@RequestParam(value = "id") String id) {
        Data data = null;
        try (Session session = factory.openSession()) {
            Transaction tx = null;
            try {
                tx = session.beginTransaction();

                data = session.get(Data.class, Integer.valueOf(id));

                tx.commit();
            } catch (HibernateException e) {
                if (tx != null) tx.rollback();
                e.printStackTrace();
            }
        }
        return data;
    }

    @RequestMapping(value = "/data/insert", method = RequestMethod.POST)
    public int insertData(@RequestParam(value = "key") String key, @RequestParam(value = "value") String value) {
        int generatedId = -1;
        try (Session session = factory.openSession()) {
            Data data = new Data();
            data.setKey(key);
            data.setValue(value);

            Transaction tx = null;
            try {
                tx = session.beginTransaction();
                session.save(data);
                generatedId = data.getId();
                tx.commit();
            } catch (HibernateException e) {
                if (tx != null) tx.rollback();
                e.printStackTrace();
            }
        }
        return generatedId;
    }

    @RequestMapping(value = "/data/delete", method = RequestMethod.DELETE)
    public void deleteData(@RequestParam(value = "id") int id) {
        try (Session session = factory.openSession()) {
            Transaction tx = null;
            try {
                tx = session.beginTransaction();

                Data data = session.load(Data.class, id);
                session.delete(data);

                tx.commit();
            } catch (HibernateException e) {
                if (tx != null) tx.rollback();
                e.printStackTrace();
            }
        }
    }

    @RequestMapping("/data/all")
    @SuppressWarnings("unchecked")
    public List<Data> getAllData() {
        List<Data> datas = new ArrayList<>();
        try (Session session = factory.openSession()) {
            Transaction tx = null;
            try {
//                tx = session.beginTransaction();


                datas = session.createQuery("from Data", Data.class).list();

//                tx.commit();
            } catch (HibernateException e) {
//                if (tx != null) tx.rollback();
                e.printStackTrace();
            }
        }
        return datas;
    }

    @RequestMapping("/data/graph")
    @SuppressWarnings("unchecked")
    public List<Point> getGraphData() {
        List<Data> datas = new ArrayList<>();
        try (Session session = factory.openSession()) {
            Transaction tx = null;
            try {
                tx = session.beginTransaction();
                datas = session.createQuery("from Data", Data.class).list();
                tx.commit();
            } catch (HibernateException e) {
                if (tx != null) tx.rollback();
                e.printStackTrace();
            }
        }
        List<Point> points = new ArrayList<>();
        for (Data data : datas){
            Point point = new Point();
            point.setX(data.getKey());
            point.setY(Integer.parseInt(data.getValue()));
            points.add(point);
        }

        return points;
    }

    class Point {
        private String x;
        private Integer y;

        public String getX() {
            return x;
        }

        public void setX(String x) {
            this.x = x;
        }

        public Integer getY() {
            return y;
        }

        public void setY(Integer y) {
            this.y = y;
        }
    }


}
