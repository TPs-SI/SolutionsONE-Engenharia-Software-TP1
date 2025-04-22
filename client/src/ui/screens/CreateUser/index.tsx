import "./styles.css";
import { useState } from "react";
import { createUser } from "../../../Services/api";

import Sidebar from "../../components/Sidebar";
import DefaultContainer from "../../components/DefaultContainer";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatCellphone = (value: string) =>
    value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2");

  const formatBirth = (value: string) =>
    value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d{4})$/, "$1/$2");

  const validatePassword = (password: string) => {
    if (password.length < 8) return "Senha deve ter no mínimo 8 caracteres";
    if (!/[0-9]/.test(password)) return "Senha deve conter número";
    if (!/[A-Z]/.test(password)) return "Senha deve conter letra maiúscula";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Senha deve conter caractere especial";
    return "";
  };

  const validateBirthdate = (birthdate: string) => {
    const [d, m, y] = birthdate.split("/").map(Number);
    const date = new Date(y, m - 1, d);
    if (date > new Date()) return "Data futura inválida";
    if (y < 1908) return "Ano inválido";
    if (m < 1 || m > 12) return "Mês inválido";
    if (d < 1 || d > 31) return "Dia inválido";
    if (m === 2 && d > 29) return "Fevereiro tem no máximo 29 dias";
    if ([4, 6, 9, 11].includes(m) && d > 30)
      return "Esse mês tem no máximo 30 dias";
    return "";
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Nome é obrigatório";
    if (!formData.birthdate)
      newErrors.birthdate = "Data de nascimento obrigatória";
    else {
      const birthErr = validateBirthdate(formData.birthdate);
      if (birthErr) newErrors.birthdate = birthErr;
    }
    if (!formData.email) newErrors.email = "Email é obrigatório";
    if (!formData.phone || formData.phone.length !== 15)
      newErrors.phone = "Telefone inválido";

    if (!formData.password) newErrors.password = "Senha é obrigatória";
    else {
      const passErr = validatePassword(formData.password);
      if (passErr) newErrors.password = passErr;
    }

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Senhas não coincidem";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      email: formData.email,
      name: formData.name,
      password: formData.password,
      cellphone: formatCellphone(formData.phone),
      birth: formatBirth(formData.birthdate),
      status: null,
      role: null,
    };

    setLoading(true);
    try {
      const response = await createUser(payload);
      navigate("/users");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Erro ao criar usuário";
      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar />
      <DefaultContainer>
        <form className="create-user-form" onSubmit={handleSubmit}>
          <header className="create-header">
            <h1>Criar Novo Usuário</h1>
          </header>

          <div className="form-section">
            <h2 className="section-title">Dados Pessoais</h2>

            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="birthdate">Data de Nascimento</label>
              <input
                type="text"
                name="birthdate"
                maxLength={10}
                value={formatBirth(formData.birthdate)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    birthdate: formatBirth(e.target.value),
                  })
                }
                required
              />
              {errors.birthdate && (
                <p className="error-message">{errors.birthdate}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Celular</label>
              <input
                type="tel"
                name="phone"
                maxLength={15}
                value={formatCellphone(formData.phone)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: formatCellphone(e.target.value),
                  })
                }
                required
              />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Senha</h2>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="button button-primary"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
            {errors.form && <p className="error-message">{errors.form}</p>}
          </div>
        </form>
      </DefaultContainer>
    </>
  );
};

export default CreateUser;
